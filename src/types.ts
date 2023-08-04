enum WidgetFileType {
  TEMPLATE = 'widget.html',
  CONFIGURATION = 'config.json',
  SCHEMA = 'schema.json',
  META = 'widget.yaml',
  QUERY = 'query.graphql',
  QUERY_PARAMS = 'queryParams.json',
  QUERY_PARAMS_BUILDER = 'queryParamsBuilder.json',
  TRANSLATION = 'schema_translations.json'
}

export interface FileLoaderResponse {
  type: WidgetFileType;
  data: string;
}

export interface SocketData {
  event: string;
  html: string;
  path: string;
}

export default WidgetFileType;

export interface PublishWidgetResponse {
  uuid: string;
}

export interface WidgetPreviewRenderResponse {
  data: {
    html: string;
  };
}

export interface WidgetPreviewRenderRequest {
  widget_configuration: object;
  widget_template: string;
  placement_uuid: string;
  widget_uuid: string;
  storefront_api_query: string;
  storefront_api_query_params: object;
  channel_id: number;
}

export enum SchemaElementType {
  ARRAY = 'array',
  TAB = 'tab',
  HIDDEN = 'hidden',
}

export enum SettingType {
  ALIGNMENT = 'alignment',
  BOOLEAN = 'boolean',
  BOX_MODEL = 'boxModel',
  CODE = 'code',
  COLOR = 'color',
  IMAGE_MANAGER = 'imageManager',
  INPUT = 'input',
  NUMBER = 'number',
  PRODUCT_ID = 'productId',
  PRODUCT_IMAGE = 'productImage',
  RANGE = 'range',
  REGEX_INPUT = 'regexInput',
  SELECT = 'select',
  TEXT = 'text',
  TOGGLE = 'toggle',
}

export enum ParseType {
  Int = 'integer',
  Float = 'float',
}

export const enum ThumbnailType {
  IMAGE = 'image',
  COLOR = 'color',
  UNKNOWN = 'unknown',
}

export type SchemaElement = TabSchemaElement | ArraySchemaElement | HiddenSchemaElement;

export interface WidgetConfiguration {
  [key: string]: any;
}

export type Thumbnail = ConditionalThumbnail | SimpleThumbnail;

export interface ConditionalThumbnail {
  conditionKey: string; // background.type
  thumbnailConditions: {
      [conditionValue: string]: SimpleThumbnail; // image: {valueKey: 'background.imageUrl.src', type: 'image'}
  };
}

export interface SimpleThumbnail {
  valueKey: string; // 'background.imageUrl.src'
  type: ThumbnailType;
}

export interface ArraySchemaElement {
  type: SchemaElementType.ARRAY;
  label: string;
  id: string; //  ex: slides
  defaultCount?: number;
  entryLabel: string;
  thumbnail?: Thumbnail;
  schema: (TabSchemaElement|ArraySchemaElement)[];
}

export interface HiddenSchemaElement {
  type: SchemaElementType.HIDDEN | string;
  settings: BaseSchemaSetting[];
}

export interface TabSchemaElement {
  type: SchemaElementType.TAB | string;
  label: string;
  sections: SchemaSection[];
}

export interface AdvancedControlType {
  label: string;
  settings: LabeledSchemaSetting[];
}

export interface VisibilityControlType {
  default: 'show' | 'hide';
}

export interface ElementControlType {
  advanced?: AdvancedControlType;
  visibility?: VisibilityControlType;
}

export interface SchemaSection {
  label?: string; // the label for the group of settings, ex. "Text Styles"
  settings: LabeledSchemaSetting[]; // the settings which belong in group
}

export interface LabeledSchemaSetting extends BaseSchemaSetting {
  label: string;
}

export interface ConditionalSetting {
  key: string;
  operator: string;
  value: any;
}
export interface BaseSchemaSetting {
  id: string;
  default?: any;
  type?: SettingType | string;
  typeMeta?: SchemaSettingTypeMetaData;
  conditional?: ConditionalSetting;
}

export interface SelectOptionValue {
  label: string;
  value: string;
}

export interface ConditionalSettingsValue {
  condition: string;
  settings: LabeledSchemaSetting[];
}

enum SchemaSettingTag {
  ADVANCED = 'advanced',
}

export enum AlignmentSettingDisplay {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  BOTH = 'both',
}

enum CodeSyntaxHighlightLanguage {
  HTML = 'html',
}

export interface RangeValues {
  max?: number;
  min?: number;
  sliderMax?: number;
  sliderMin?: number;
  step: number;
  unit?: string;
}

export interface RegExPattern {
  configKey: string;
  matchIndex: number;
  pattern: string;
}

export interface SchemaSettingTypeMetaData {
  controls?: ElementControlType;
  reference?: string;
  regExPatterns?: RegExPattern[];
  conditionalSettings?: ConditionalSettingsValue[];
  tags?: SchemaSettingTag[];
  selectOptions?: SelectOptionValue[]; // applicable for select type
  settings?: LabeledSchemaSetting[]; // applicable for array type
  display?: AlignmentSettingDisplay; // applicable for alignment type
  helpInfo?: string; // show a help text bubble next to the setting with additional info
  language?: CodeSyntaxHighlightLanguage; // applicable for the code type
  placeholder?: string;
  rangeValues?: RangeValues; // applicable for range type
  maxLength?: number; // Applicable to type text
  parseType?: ParseType;
}

export interface StorefrontApiQueryParams {
  [key: string]: any;
}

export interface QueryParamBuilder {
  [key: string]: any;
}

export interface WidgetTemplateEntry {
  icon_name: string;
  uuid: string;
  name: string;
  schema: (TabSchemaElement|ArraySchemaElement)[];
  template: string;
  kind: string;
  storefront_api_query: string;
}

export interface CategoryEntry {
  uuid: string;
  name: string;
  key: string;
  widget_templates: WidgetTemplateEntry[];
}
