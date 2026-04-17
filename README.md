# ilias-client
**Inofficial client library for fetching data from ILIAS instances**

## Example usage
```typescript
import { IliasClient } from "ilias-client";
import type { IliasMembershipItem, IliasContentItem } from "ilias-client";

const client = new IliasClient("https://ilias.example.com");
await client.login("username", "password");

const courseMemberships: IliasMembershipItem[] = await client.fetchMemberships();

for (const courseMembership of courseMemberships) {
    const items: IliasContentItem[] = await client.fetchContents(courseMembership.refId);
    
    for (const item of items) {
        if (item.itemType === "file") {
            const blob = await client.fetchFileBlob(item.refId);
            
            // e.g. save the downloaded file blob to the local disk etc.
            // ...
        }
    }
}
```

Note that this library fetches data by interacting with the website since ILIAS doesn't
seem to have a universal API so be aware that things may break at any point.

Also, while this library is intended to work with other package managers and runtimes as well,
it is developed and tested with [Bun](https://bun.com/), so your mileage may vary if you're not using Bun.
