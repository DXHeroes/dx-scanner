declare global {
    namespace jest {
        interface Matchers<R> {
            toContainObject(object: Record<string, any>): Promise<Record<string, unknown>>;
        }
    }
}
export {};
//# sourceMappingURL=DashboardReporter.spec.d.ts.map