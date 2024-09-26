export interface Config {
  /**
   * @visibility backend
   */
  ocm: {
    /**
     * @visibility backend
     */
    'webRcaUIUrl': string;

    /**
     * @visibility secret
     */
    'clientId': string;

    /**
     * @visibility secret
     */
    'clientSecret': string;
  };
}
