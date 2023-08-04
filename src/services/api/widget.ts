import Axios, { AxiosResponse } from 'axios';

import AUTH_CONFIG from '../auth/authConfig';
import { WidgetConfiguration } from '../schema/schemaParser/schemaParser';

interface PublishWidgetResponse {
    uuid: string;
  }

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

/**
 * Fetches a widget preview by sending a POST request to the specified API endpoint.
 *
 * @param data - The request data for rendering the widget preview.
 * @returns A Promise that resolves to the rendered HTML content of the widget preview.
 * @throws An Error if the API request fails or if there is an error in the response.
 *
 * @example
 * // Usage example:
 * const requestData: WidgetPreviewRenderRequest = {
 *   widget_configuration: { },
 *   widget_template: "template_id",
 *   placement_uuid: "placement_id",
 *   widget_uuid: "widget_id",
 *   storefront_api_query: "api_query_string",
 *   storefront_api_query_params: { },
 *   channel_id: 123,
 *   schema_translations: "schema_translation_string",
 * };
 *
 * try {
 *   const widgetHTML = await getWidget(requestData);
 *   console.log(widgetHTML); // Output the rendered HTML content of the widget preview.
 * } catch (error) {
 *   console.error('Failed to fetch widget preview:', error.message);
 * }
 */
export async function getWidget(data: WidgetPreviewRenderRequest): Promise<string> {
    try {
        const response: AxiosResponse<WidgetPreviewRenderResponse> = await Axios.post(
            widgetApi.widgetPreviewRender,
            data,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Auth-Client': AUTH_CONFIG.authId,
                    'X-Auth-Token': AUTH_CONFIG.authToken,
                },
            },
        );

        return response.data.data.html;
    } catch (error) {
        throw new Error('Request failed with status code 400'); // You can customize the error message
    }
}

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
 * ```ts
 * const widgetData = { };
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
