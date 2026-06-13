## Table `ownerships`

### Columns

| Name          | Type          | Constraints |
| ------------- | ------------- | ----------- |
| `id`          | `uuid`        | Primary     |
| `listing_id`  | `uuid`        | Nullable    |
| `owner_name`  | `text`        |             |
| `owner_email` | `text`        |             |
| `slots`       | `int4`        |             |
| `created_at`  | `timestamptz` | Nullable    |
