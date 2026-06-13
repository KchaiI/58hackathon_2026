## Table `ownerships`

### Columns

| Name         | Type          | Constraints |
| ------------ | ------------- | ----------- |
| `id`         | `uuid`        | Primary     |
| `listing_id` | `uuid`        | Nullable    |
| `slots`      | `int4`        |             |
| `created_at` | `timestamptz` | Nullable    |
| `user_id`    | `uuid`        | Nullable    |
