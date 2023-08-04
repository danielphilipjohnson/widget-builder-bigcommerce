import fs from 'fs/promises';

import WidgetFileType, { FileLoaderResponse } from '../../../types';
import { messages } from '../../../messages';

export default async function queryParamsLoader(widgetDir: string): Promise<FileLoaderResponse> {
    try {
        const data = await fs.readFile(`${widgetDir}/${WidgetFileType.QUERY_PARAMS}`, 'utf8');
        return {
            type: WidgetFileType.QUERY_PARAMS,
            data,
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return {
                type: WidgetFileType.QUERY_PARAMS,
                data: '{}',
            };
        }
        throw new Error(messages.invalidQueryParams());
    }
}
