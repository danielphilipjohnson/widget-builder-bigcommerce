import fs from 'fs/promises';

import WidgetFileType, { FileLoaderResponse } from '../../../types';
import { messages } from '../../../messages';

export default async function queryParamsBuilderLoader(widgetDir: string): Promise<FileLoaderResponse> {
    try {
        const data = await fs.readFile(`${widgetDir}/${WidgetFileType.QUERY_PARAMS_BUILDER}`, 'utf8');

        if (!data) {
            throw new Error(messages.invalidQueryParamsBuilder());
        }

        return {
            type: WidgetFileType.QUERY_PARAMS_BUILDER,
            data,
        };
    } catch (error) {
        throw new Error(messages.invalidQueryParamsBuilder());
    }
}
