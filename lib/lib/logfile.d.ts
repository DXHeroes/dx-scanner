export declare class Logfile {
    private authorization?;
    private apiToken?;
    constructor();
    enabled: boolean;
    fname: string;
    private file;
    /**
     * Get secrets to be redacted.
     * @param authorization
     * @param apiToken
     */
    getSecrets(authorization?: string, apiToken?: string): void;
    /**
     * Writes the given string to the log file.
     * @param {*} content The string to write
     * @memberof LogFile
     */
    write(content: string): void;
    /**
     * Writes the given value to the log file, followed by a newline.
     * @param {*} args The values to write
     * @memberof LogFile
     */
    log(format: any, ...args: any[]): void;
}
/**
 * The Logfile instance, contains methods for writing to the logfile directly
 */
export declare const logfile: Logfile;
/**
 * Enables the logfile methods and
 * intercepts calls to `debug` to also write to `dxscanner.log`
 */
export declare function enableLogfile(): void;
//# sourceMappingURL=logfile.d.ts.map