CREATE LOGIN marisa WITH PASSWORD = 'admin';

use Backend_TPO_Mari_Sam;
CREATE USER marisa FOR LOGIN marisa;

ALTER ROLE db_owner ADD MEMBER marisa;