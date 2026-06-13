## Table `producers`

### Columns

| Name          | Type          | Constraints |
| ------------- | ------------- | ----------- |
| `id`          | `uuid`        | Primary     |
| `name`        | `text`        |             |
| `location`    | `text`        | Nullable    |
| `description` | `text`        | Nullable    |
| `image_url`   | `text`        | Nullable    |
| `created_at`  | `timestamptz` | Nullable    |
