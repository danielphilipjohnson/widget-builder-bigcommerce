import fs from 'fs/promises';

import WidgetFileType, { FileLoaderResponse } from '../../../types';
import { messages } from '../../../messages';

export default async function queryLoader(widgetDir: string): Promise<FileLoaderResponse> {
    try {
        const data = await fs.readFile(`${widgetDir}/${WidgetFileType.QUERY}`, 'utf8');
        return {
            type: WidgetFileType.QUERY,
            data,
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return {
                type: WidgetFileType.QUERY,
                data: '',
            };
        }
        throw new Error(messages.invalidQuery());
    }
}
