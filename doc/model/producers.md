## Table `producers`

### Columns

| Name          | Type          | Constraints |
| ------------- | ------------- | ----------- |
| `name`        | `text`        |             |
| `location`    | `text`        | Nullable    |
| `description` | `text`        | Nullable    |
| `image_url`   | `text`        | Nullable    |
| `created_at`  | `timestamptz` | Nullable    |
| `user_id`     | `uuid`        | Primary     |
