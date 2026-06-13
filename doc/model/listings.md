## Table `listings`

### Columns

| Name              | Type          | Constraints |
| ----------------- | ------------- | ----------- |
| `id`              | `uuid`        | Primary     |
| `producer_id`     | `uuid`        | Nullable    |
| `title`           | `text`        |             |
| `description`     | `text`        | Nullable    |
| `crop`            | `text`        |             |
| `price`           | `int4`        |             |
| `total_slots`     | `int4`        |             |
| `available_slots` | `int4`        |             |
| `image_url`       | `text`        | Nullable    |
| `harvest_date`    | `date`        | Nullable    |
| `created_at`      | `timestamptz` | Nullable    |
