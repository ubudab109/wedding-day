import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

// Guest book ("Doa & Ucapan"). One DynamoDB table shared by every guest.
// Guests use the site's public API key and may only add and read wishes — never edit or delete.
const schema = a.schema({
  Wish: a
    .model({
      name: a.string().required(),
      message: a.string().required(),
      attendance: a.enum(['hadir', 'ragu', 'tidak']),
      // When the guest originally wrote it. Set for wishes recovered from a guest's browser,
      // which an earlier version of the site kept locally; otherwise `createdAt` is used.
      sentAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey().to(['create', 'read'])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    // Comfortably past the wedding (07 Nov 2026); max is 365.
    apiKeyAuthorizationMode: { expiresInDays: 365 },
  },
});
