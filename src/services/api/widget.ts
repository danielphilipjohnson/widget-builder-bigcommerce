import Axios, { AxiosResponse } from 'axios';

import AUTH_CONFIG from '../auth/authConfig';
import { WidgetConfiguration } from '../schema/schemaParser/schemaParser';

export const widgetApi = {
    widgetPreviewRender: `${AUTH_CONFIG.apiPath}/content/widget-templates/preview`,
    widgetTemplatePublish: `${AUTH_CONFIG.apiPath}/content/widget-templates`,
};

interface WidgetPreviewRenderResponse {
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

export function getWidget(data: WidgetPreviewRenderRequest): Promise<string> {
    return new Promise((resolve, reject) => {
        Axios({
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Client': AUTH_CONFIG.authId,
                'X-Auth-Token': AUTH_CONFIG.authToken,
            },
            data,
            url: widgetApi.widgetPreviewRender,
        })
            .then(
                ({
                    data: {
                        data: { html },
                    },
                }: AxiosResponse<WidgetPreviewRenderResponse>) => {
                    resolve(html);
                },
            )
            .catch((err: Error) => reject(err));
    });
}

interface PublishWidgetResponse {
  uuid: string;
}
// jest src/services/api/widget.test.ts

// export const publishWidget = (
//    widgetData: WidgetConfiguration,
//    uuid: string | null,
// ): Promise<PublishWidgetResponse> => new Promise((resolve, reject) => {
//    Axios({
//        method: uuid ? 'put' : 'post',
//        headers: {
//            Accept: 'application/json',
//            'Content-Type': 'application/json',
//            'X-Auth-Client': AUTH_CONFIG.authId,
//            'X-Auth-Token': AUTH_CONFIG.authToken,
//        },
//        data: widgetData,
//        url: `${widgetApi.widgetTemplatePublish}${uuid ? `/${uuid}` : ''}`,
//    })
//        .then(({ data: { data } }) => resolve(data))
//        .catch((error) => reject(error));
// });

/**
 * Publishes a widget template to the server.
 * If a UUID is provided, it updates an existing widget template,
 * otherwise, it creates a new one.
 *
 * @param widgetData - The widget configuration to be published.
 * @param uuid - The UUID of the widget template to update (if applicable).
 * @returns A Promise that resolves to the response data from the server.
 *
 * @example
 * ```typescript
 * const widgetData = { /* Your widget configuration object * / };
 * const uuid = '12345'; // or null for creating a new template
 *
 * try {
 *   const response = await publishWidget(widgetData, uuid);
 *   console.log('Widget template published:', response.data);
 * } catch (error) {
 *   console.error('Error publishing widget template:', error.message);
 * }
 * ```
 */
export const publishWidget = async (
    widgetData: WidgetConfiguration,
    uuid: string | null,
): Promise<PublishWidgetResponse> => {
    const method = uuid ? 'put' : 'post';
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Client': AUTH_CONFIG.authId,
        'X-Auth-Token': AUTH_CONFIG.authToken,
    };

    let url = widgetApi.widgetTemplatePublish;
    if (uuid) {
        url += `/${uuid}`;
    }

    try {
        const response = await Axios({
            method, headers, data: widgetData, url,
        });

        return response.data.data;
    } catch (error) {
        throw new Error('Request failed with status code 400');
    }
};
