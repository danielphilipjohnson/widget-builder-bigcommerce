import { log, messages } from '../../messages';

import { AuthConfig } from './authConfig';

const checkCredentials = (authConfig: AuthConfig): boolean => {
    const checkStatus = Object.values(authConfig).every((value) => Boolean(value));

    if (!checkStatus) {
        Object.keys(authConfig).forEach((key) => {
            if (!authConfig[key]) {
                log.error(messages.invalidAuth(key));
            }
        });
    }

    return checkStatus;
};

export default checkCredentials;
