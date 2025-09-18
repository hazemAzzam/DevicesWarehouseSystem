-- SQL script to create the Devices table in Microsoft Access
-- This script can be used to create the table manually in Access

CREATE TABLE Devices (
    ID AUTOINCREMENT PRIMARY KEY,
    DeviceName TEXT(255) NOT NULL,
    DeviceType TEXT(100) NOT NULL,
    SerialNumber TEXT(100) UNIQUE NOT NULL,
    CreatedAt DATETIME DEFAULT NOW(),
    UpdatedAt DATETIME DEFAULT NOW()
);

-- Insert sample data
INSERT INTO Devices (DeviceName, DeviceType, SerialNumber) VALUES 
('لابتوب Dell', 'Laptop', 'DL001234567'),
('طابعة HP', 'Printer', 'HP987654321'),
('شاشة Samsung', 'Monitor', 'SM456789123'),
('ماوس Logitech', 'Mouse', 'LG789123456'),
('كيبورد Microsoft', 'Keyboard', 'MS123456789');
