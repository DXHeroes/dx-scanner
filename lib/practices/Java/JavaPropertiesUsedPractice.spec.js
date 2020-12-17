"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JavaPropertiesUsedPractice_1 = require("./JavaPropertiesUsedPractice");
const model_1 = require("../../model");
const inversify_config_1 = require("../../inversify.config");
const pomXMLContents_mock_1 = require("../../detectors/__MOCKS__/Java/pomXMLContents.mock");
describe('JavaPropertiesUsedPractice', () => {
    let practice;
    let containerCtx;
    beforeAll(() => {
        containerCtx = inversify_config_1.createTestContainer();
        containerCtx.container.bind('JavaPropertiesUsedPractice').to(JavaPropertiesUsedPractice_1.JavaPropertiesUsedPractice);
        practice = containerCtx.container.get('JavaPropertiesUsedPractice');
    });
    afterEach(async () => {
        containerCtx.virtualFileSystemService.clearFileSystem();
        containerCtx.practiceContext.fileInspector.purgeCache();
    });
    it('Returns practicing if there is a .properties file', async () => {
        const properties = `
    spring.jpa.database=mysql
    spring.datasource.url=jdbc:mysql://localhost:3306/<YOUR DATABASE NAME>?serverTimezone=GMT-2
    spring.datasource.username=<YOUR DB USERNAME>
    spring.datasource.password=<YOUR DB PASSWORD>
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
    spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
    server.port=8080
    management.server.port=9001
    management.endpoints.web.exposure.include=*
    `;
        containerCtx.virtualFileSystemService.setFileSystem({
            '/target/config/application.properties': properties,
            'pom.xml': pomXMLContents_mock_1.pomXMLContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.practicing);
    });
    it('Returns notPracticing if there are no .properties files', async () => {
        containerCtx.virtualFileSystemService.setFileSystem({
            'pom.xml': pomXMLContents_mock_1.pomXMLContents,
        });
        const evaluated = await practice.evaluate(containerCtx.practiceContext);
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.notPracticing);
    });
    it('Returns unknown if there is no fileInspector', async () => {
        const evaluated = await practice.evaluate(Object.assign(Object.assign({}, containerCtx.practiceContext), { fileInspector: undefined }));
        expect(evaluated).toEqual(model_1.PracticeEvaluationResult.unknown);
    });
    it('Is applicable to Java', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Java;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is applicable to Kotlin', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Kotlin;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(true);
    });
    it('Is not applicable to other languages', async () => {
        containerCtx.practiceContext.projectComponent.language = model_1.ProgrammingLanguage.Ruby;
        const result = await practice.isApplicable(containerCtx.practiceContext);
        expect(result).toEqual(false);
    });
});
//# sourceMappingURL=JavaPropertiesUsedPractice.spec.js.map