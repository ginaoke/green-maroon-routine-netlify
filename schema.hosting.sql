-- Pakai file ini untuk database hosting/Aiven.
-- Pastikan sudah memilih database yang benar di DBeaver sebelum execute.

CREATE TABLE IF NOT EXISTS schedule_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_date DATE NULL,
  weekday TINYINT NULL COMMENT '0=Minggu, 1=Senin, ... 6=Sabtu. Dipakai untuk default template.',
  time_value CHAR(5) NOT NULL,
  title VARCHAR(160) NOT NULL,
  note TEXT NULL,
  category VARCHAR(40) NOT NULL DEFAULT 'love',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_schedule_date (event_date),
  INDEX idx_schedule_weekday (weekday)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS music_tracks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  source_type ENUM('default', 'upload') NOT NULL,
  url TEXT NULL,
  original_filename VARCHAR(255) NULL,
  mime_type VARCHAR(120) NULL,
  audio_data LONGBLOB NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO music_tracks (title, source_type, url, original_filename, is_active)
SELECT 'Default Romantic Music', 'default', '/assets/default-romantic.wav', 'default-romantic.wav', 1
WHERE NOT EXISTS (
  SELECT 1 FROM music_tracks WHERE source_type = 'default' AND url = '/assets/default-romantic.wav'
);

CREATE TABLE IF NOT EXISTS love_notes (
  page_key VARCHAR(60) PRIMARY KEY,
  body TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
