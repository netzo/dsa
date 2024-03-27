## Resources and Relationships

### Facilities

Facilities represent the physical locations where sessions are held, like tennis
courts or pools.

- **Relationships**:
  - Facilities to Slots: One-to-Many. Each facility has multiple slots.
  - Facilities to Sessions: One-to-Many. Each facility can host multiple
    sessions.

### Slots

Time intervals available for booking at each facility.

- **Relationships**:
  - Slots to Sessions: One-to-One or One-to-Many. Each slot can accommodate one
    or multiple sessions, depending on the setup.

### Sessions

The classes, lessons, or appointments available for booking.

- **Relationships**:
  - Sessions to Bookings: One-to-Many. Each session can be booked multiple times
    by different users.
  - Sessions to Users (via Bookings): Many-to-Many. Users can book multiple
    sessions, and sessions can have multiple users booked.

### Users

Individuals who use the system to make bookings.

- **Relationships**:
  - Users to Bookings: One-to-Many. Each user can make multiple bookings.

### Bookings

Records of users reserving specific sessions.

- **Relationships**:
  - Bookings to Users: Many-to-One. Multiple bookings can be associated with a
    single user.
  - Bookings to Sessions: Many-to-One. Multiple bookings can be made for the
    same session, assuming it supports multiple participants.

## Summary

- **Facilities** have multiple **Slots** and host multiple **Sessions**.
- **Slots** are designated times at **Facilities** and can be linked to one or
  more **Sessions**.
- **Sessions** occur during **Slots** at **Facilities** and can have multiple
  **Bookings** by **Users**.
- **Users** can make multiple **Bookings** for different **Sessions**.
- **Bookings** connect **Users** to **Sessions** and, indirectly, to **Slots**
  and **Facilities**.
