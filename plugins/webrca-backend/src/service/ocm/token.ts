export async function refresh(url: string, client_id: string, client_secret: string) {
  // @REF [URL Encoded form body](https://stackoverflow.com/questions/35325370/how-do-i-post-a-x-www-form-urlencoded-request-using-fetch/37562814#37562814)
  const details: { [index: string]: string } = {
    grant_type: 'client_credentials',
    client_id: client_id,
    client_secret: client_secret,
    scope: 'openid api.ocm',
  };

  const formBody = [];
  for (const property in details) {
    if (Object.prototype.hasOwnProperty.call(details, property)) {
      const encodedKey: string = encodeURIComponent(property);
      const encodedValue: string = encodeURIComponent(details[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
  }
  const formBodyString = formBody.join('&');

  return await fetch(
    `${url}/api/proxy/sso-redhat/auth/realms/redhat-external/protocol/openid-connect/token`,
    {
      method: 'POST',
      body: formBodyString,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
  .catch(error => error)
  .then(resp => resp.json());
}
