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
