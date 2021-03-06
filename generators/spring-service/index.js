/**
 * Copyright 2013-2018 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const _ = require('lodash');
const BaseGenerator = require('../generator-base');
const constants = require('../generator-constants');

const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;

module.exports = class extends BaseGenerator {
    constructor(args, opts) {
        super(args, opts);
        this.argument('name', { type: String, required: true });
        this.name = this.options.name;
    }

    initializing() {
        this.log(`The service ${this.name} is being created.`);
        this.baseName = this.config.get('baseName');
        this.packageName = this.config.get('packageName');
        this.packageFolder = this.config.get('packageFolder');
        this.databaseType = this.config.get('databaseType');
    }

    prompting() {
        const done = this.async();

        const prompts = [
            {
                type: 'confirm',
                name: 'useInterface',
                message: '(1/1) Do you want to use an interface for your service?',
                default: false
            }
        ];
        this.prompt(prompts).then((props) => {
            this.useInterface = props.useInterface;
            done();
        });
    }

    get default() {
        return {
            insight() {
                const insight = this.insight();
                insight.trackWithEvent('generator', 'service');
                insight.track('service/interface', this.useInterface);
            }
        };
    }

    writing() {
        this.serviceClass = _.upperFirst(this.name);
        this.serviceInstance = _.lowerCase(this.name);

        this.template(
            `${SERVER_MAIN_SRC_DIR}package/service/Service.java.ejs`,
            `${SERVER_MAIN_SRC_DIR + this.packageFolder}/service/${this.serviceClass}Service.java`
        );

        if (this.useInterface) {
            this.template(
                `${SERVER_MAIN_SRC_DIR}package/service/impl/ServiceImpl.java.ejs`,
                `${SERVER_MAIN_SRC_DIR + this.packageFolder}/service/impl/${this.serviceClass}ServiceImpl.java`
            );
        }
    }
};
