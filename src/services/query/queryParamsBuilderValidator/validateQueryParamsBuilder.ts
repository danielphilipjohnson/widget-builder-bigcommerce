import { log } from '../../../messages';
import queryParamsBuilderLoader from '../queryParamsBuilderLoader/queryParamsBuilderLoader';

import QueryParamsBuilderValidator from './queryParamsBuilderValidator';

export default async function validateQueryParamsBuilder(directory: string) {
    try {
        const { data } = await queryParamsBuilderLoader(directory);
        const queryParamsBuilder = JSON.parse(data);
        const validator = new QueryParamsBuilderValidator(queryParamsBuilder);
        validator.validate();
    } catch (error) {
        log.error(error);
    }
}
