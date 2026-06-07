# Shared Backend Infrastructure

Reusable infrastructure that is not owned by one feature module.

- `SharedModule`: common services used across features.
- `RedisModule` and `BullQueueModule`: Redis clients and queue event helpers.
- `constants`: shared queue names and application constants.
- `utilities`: focused helpers such as Bull connection and vector validation.
- [`seeder`](seeder/README.md): development seed entry point.

Keep feature-specific business logic under `src/modules`, not here.
