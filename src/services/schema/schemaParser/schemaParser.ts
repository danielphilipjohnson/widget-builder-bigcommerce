/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    ArraySchemaElement,
    BaseSchemaSetting,
    ConditionalSettingsValue,
    ElementControlType,
    HiddenSchemaElement,
    RegExPattern,
    SchemaElement,
    SchemaElementType,
    SchemaSection,
    TabSchemaElement,
    WidgetConfiguration,
} from '../../../types';

// eslint-disable-next-line default-param-last
function parseRegExPatternsDefaults(
    id: string,
    defaultValue = '',
    regExPatterns: RegExPattern[],
) {
    const regExPatternConfigurations: WidgetConfiguration = {};
    const config: WidgetConfiguration = {};
    const partsConfig: WidgetConfiguration = {};
    const value = 'value';
    const parts = 'parts';

    regExPatterns.forEach((regExPattern) => {
        const { pattern, matchIndex = 0, configKey } = regExPattern;
        const re = new RegExp(pattern);
        const matchResult = re.exec(defaultValue);
        partsConfig[configKey] = matchResult ? matchResult[matchIndex] : null;
    });

    config[value] = defaultValue;
    config[parts] = partsConfig;
    regExPatternConfigurations[id] = config;

    return regExPatternConfigurations;
}

function parseConditionalDefaults(selectOptions: ConditionalSettingsValue[]) {
    const conditionalConfigurations: WidgetConfiguration = {};
    selectOptions.forEach((option) => {
        if (option?.settings) {
            option.settings.forEach((conditionalSetting) => {
                conditionalConfigurations[conditionalSetting.id] = conditionalSetting.default;
            });
        }
    });

    return conditionalConfigurations;
}

function parseElementDefaults(controls: ElementControlType) {
    const elementConfigurations: Record<string, any> = {};
    Object.keys(controls).forEach((control) => {
        const content = controls[control];
        if (content?.settings) {
            content.settings.forEach((setting: BaseSchemaSetting) => {
                elementConfigurations[setting.id] = setting.default;
            });
        } else {
            elementConfigurations[control] = content.default;
        }
    });

    return elementConfigurations;
}

function buildSettingsDefaults(settings: BaseSchemaSetting[]) {
    let configuration: WidgetConfiguration = {};

    settings.forEach((setting: BaseSchemaSetting) => {
        if (setting.typeMeta) {
            if (setting.typeMeta.conditionalSettings) {
                const parsedDefaults = parseConditionalDefaults(
                    setting.typeMeta.conditionalSettings,
                );

                configuration = {
                    ...configuration,
                    ...parsedDefaults,
                };
            }

            if (setting.typeMeta.controls) {
                const parsedDefaults = parseElementDefaults(setting.typeMeta.controls);

                configuration = {
                    ...configuration,
                    ...{
                        [setting.id]: parsedDefaults,
                    },
                };
            }

            if (setting.typeMeta.regExPatterns) {
                const parsedDefaults = parseRegExPatternsDefaults(
                    setting.id,
                    setting.default,
                    setting.typeMeta.regExPatterns,
                );

                configuration = {
                    ...configuration,
                    ...parsedDefaults,
                };
            }
        }

        if (setting.default) {
            configuration[`${setting.id}`] = setting.default;
        }
    });

    return configuration;
}

function parseTabSchemaDefaults(tabSections: SchemaSection[]) {
    let configuration = {};

    tabSections.forEach((section: SchemaSection) => {
        const settingsDefaults = buildSettingsDefaults(section.settings);
        configuration = {
            ...configuration,
            ...settingsDefaults,
        };
    });

    return configuration;
}

export function parseArraySchemaDefaults(
    arraySchemaElement: ArraySchemaElement,
) {
    let configuration: WidgetConfiguration = {};

    const defaultCount = arraySchemaElement.defaultCount || 1;
    const arraySchema = arraySchemaElement.schema;
    const arraySchemaId = arraySchemaElement.id;
    configuration[`${arraySchemaId}`] = [];
    let arrayElementConfiguration: WidgetConfiguration = {};
    arraySchema.forEach((schemaElement: SchemaElement) => {
        if (schemaElement.type === SchemaElementType.TAB) {
            const tabSchemaElement = schemaElement as TabSchemaElement;
            const tabSettingDefaults = parseTabSchemaDefaults(
                tabSchemaElement.sections,
            );
            arrayElementConfiguration = {
                ...arrayElementConfiguration,
                ...tabSettingDefaults,
            };
        }

        if (schemaElement.type === SchemaElementType.HIDDEN) {
            const hiddenSchemaElement = schemaElement as HiddenSchemaElement;
            const hiddenSettingDefaults = buildSettingsDefaults(
                hiddenSchemaElement.settings,
            );

            arrayElementConfiguration = {
                ...arrayElementConfiguration,
                ...hiddenSettingDefaults,
            };
        }
    });

    for (let i = 1; i <= defaultCount; i++) {
        configuration[`${arraySchemaId}`].push({ ...arrayElementConfiguration });
    }

    arraySchema.forEach(
        (schemaElement: TabSchemaElement | ArraySchemaElement) => {
            if (schemaElement.type === SchemaElementType.ARRAY) {
                const subArraySchemaElement = schemaElement as ArraySchemaElement;
                const arrayConfiguration = parseArraySchemaDefaults(
                    subArraySchemaElement,
                );
                configuration = {
                    ...configuration,
                    ...arrayConfiguration,
                };
            }
        },
    );

    return configuration;
}

export function generateWidgetConfiguration(
    schema: (TabSchemaElement | ArraySchemaElement | HiddenSchemaElement)[],
) {
    let configuration: WidgetConfiguration = {};
    schema.forEach((schemaElement: SchemaElement) => {
        if (schemaElement.type === SchemaElementType.TAB) {
            const tabSchemaElement = schemaElement as TabSchemaElement;
            const tabSectionDefaults = parseTabSchemaDefaults(
                tabSchemaElement.sections,
            );
            configuration = {
                ...configuration,
                ...tabSectionDefaults,
            };
        }

        if (schemaElement.type === SchemaElementType.ARRAY) {
            const arraySchemaElement = schemaElement as ArraySchemaElement;
            const arraySectionDefaults = parseArraySchemaDefaults(arraySchemaElement);

            configuration = {
                ...configuration,
                ...arraySectionDefaults,
            };
        }

        if (schemaElement.type === SchemaElementType.HIDDEN) {
            const hiddenSchemaElement = schemaElement as HiddenSchemaElement;
            const hiddenSettingDefaults = buildSettingsDefaults(
                hiddenSchemaElement.settings,
            );

            configuration = {
                ...configuration,
                ...hiddenSettingDefaults,
            };
        }
    });

    return { ...configuration };
}
