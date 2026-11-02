export type Platform = 'Android' | 'iOS' | 'PC';

export type GamingStyle =
  | 'One Tap'
  | 'Drag Headshot'
  | 'Sniper'
  | 'Rusher'
  | 'Movement'
  | 'Balanced';

export interface DeviceModel {
  name: string;
  refreshRate: number; // 60, 90, 120, 144, 165
  baseDpi: number;
  chipsetTier: 'entry' | 'mid' | 'flagship';
  touchSampleRate?: number;
}

export interface BrandData {
  brand: string;
  models: DeviceModel[];
}

export const DEVICES_DATABASE: Record<Platform, BrandData[]> = {
  Android: [
    {
      brand: 'Samsung',
      models: [
        // Flagship S-Series (All Generations from S1 to S25)
        { name: 'Galaxy S25 Ultra (Upcoming Flagship)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Galaxy S24 Ultra (Snapdragon 8 Gen 3)', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Galaxy S24+ / Galaxy S24', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Galaxy S23 Ultra', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Galaxy S23+ / Galaxy S23', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Galaxy S23 FE 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Galaxy S22 Ultra 5G', refreshRate: 120, baseDpi: 384, chipsetTier: 'flagship' },
        { name: 'Galaxy S22+ / Galaxy S22 5G', refreshRate: 120, baseDpi: 384, chipsetTier: 'flagship' },
        { name: 'Galaxy S21 Ultra 5G', refreshRate: 120, baseDpi: 384, chipsetTier: 'flagship' },
        { name: 'Galaxy S21+ / Galaxy S21 5G', refreshRate: 120, baseDpi: 384, chipsetTier: 'flagship' },
        { name: 'Galaxy S21 FE 5G', refreshRate: 120, baseDpi: 384, chipsetTier: 'mid' },
        { name: 'Galaxy S20 Ultra 5G (120Hz Pioneer)', refreshRate: 120, baseDpi: 384, chipsetTier: 'flagship' },
        { name: 'Galaxy S20+ / Galaxy S20 5G', refreshRate: 120, baseDpi: 384, chipsetTier: 'flagship' },
        { name: 'Galaxy S20 FE 5G / S20 FE 4G', refreshRate: 120, baseDpi: 384, chipsetTier: 'mid' },
        { name: 'Galaxy S10+ / Galaxy S10 5G', refreshRate: 60, baseDpi: 360, chipsetTier: 'mid' },
        { name: 'Galaxy S10 / Galaxy S10e / Galaxy S10 Lite', refreshRate: 60, baseDpi: 360, chipsetTier: 'mid' },
        { name: 'Galaxy S9+ / Galaxy S9', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy S8+ / Galaxy S8 / Galaxy S8 Active', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy S7 Edge / Galaxy S7', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy S6 Edge+ / Galaxy S6 Edge / Galaxy S6', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy S5 / Galaxy S5 Mini (2014)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy S4 / Galaxy S4 Mini (2013)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy S3 / Galaxy S2 / Galaxy S1 (Inception 2010)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Galaxy Note Series (Complete History Note 1 to 20)
        { name: 'Galaxy Note 20 Ultra 5G (120Hz LTPO)', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Galaxy Note 20 5G / Galaxy Note 20 4G', refreshRate: 60, baseDpi: 384, chipsetTier: 'flagship' },
        { name: 'Galaxy Note 10+ 5G / Galaxy Note 10+', refreshRate: 60, baseDpi: 360, chipsetTier: 'mid' },
        { name: 'Galaxy Note 10 / Galaxy Note 10 Lite', refreshRate: 60, baseDpi: 360, chipsetTier: 'mid' },
        { name: 'Galaxy Note 9 (Bluetooth S-Pen)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy Note 8 (Dual Camera)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy Note Fan Edition / Galaxy Note 7', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy Note 5 / Galaxy Note 4 / Galaxy Note Edge', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy Note 3 / Galaxy Note 2 / Galaxy Note 1 (Inception 2011)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Galaxy Z Fold & Flip
        { name: 'Galaxy Z Fold 6 / Galaxy Z Fold 5', refreshRate: 120, baseDpi: 420, chipsetTier: 'flagship' },
        { name: 'Galaxy Z Fold 4 / Galaxy Z Fold 3', refreshRate: 120, baseDpi: 420, chipsetTier: 'flagship' },
        { name: 'Galaxy Z Fold 2 / Galaxy Fold (2019)', refreshRate: 120, baseDpi: 420, chipsetTier: 'flagship' },
        { name: 'Galaxy Z Flip 6 / Galaxy Z Flip 5 (Flex Window)', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Galaxy Z Flip 4 / Galaxy Z Flip 3 / Galaxy Z Flip 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        // Galaxy A Series (A01 to A55 + All Historic Years)
        { name: 'Galaxy A55 5G (Metal Frame 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Galaxy A54 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Galaxy A53 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Galaxy A52s 5G (Snapdragon 778G 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Galaxy A52 5G / Galaxy A52 4G (90Hz)', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Galaxy A51 5G / Galaxy A51 4G', refreshRate: 60, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Galaxy A50s / Galaxy A50 (2019 Classic)', refreshRate: 60, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Galaxy A35 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Galaxy A34 5G (120Hz Dimensity)', refreshRate: 120, baseDpi: 384, chipsetTier: 'mid' },
        { name: 'Galaxy A33 5G', refreshRate: 90, baseDpi: 384, chipsetTier: 'mid' },
        { name: 'Galaxy A32 4G (90Hz) / Galaxy A32 5G', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Galaxy A31 / Galaxy A30s / Galaxy A30', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A25 5G (120Hz Exynos 1280)', refreshRate: 120, baseDpi: 384, chipsetTier: 'mid' },
        { name: 'Galaxy A24 4G (90Hz Super AMOLED)', refreshRate: 90, baseDpi: 384, chipsetTier: 'mid' },
        { name: 'Galaxy A23 5G (120Hz) / Galaxy A23 4G (90Hz)', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Galaxy A22 5G (90Hz) / Galaxy A22 4G (90Hz)', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Galaxy A21s / Galaxy A21 / Galaxy A20s / Galaxy A20', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A15 5G / Galaxy A15 4G (90Hz Super AMOLED)', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Galaxy A14 5G (90Hz) / Galaxy A14 4G', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Galaxy A13 5G (90Hz) / Galaxy A13 4G', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A12 / Galaxy A11 / Galaxy A10s / Galaxy A10', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A05s (FHD+ 90Hz) / Galaxy A05', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A04s (90Hz) / Galaxy A04 / Galaxy A04e', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A03s / Galaxy A03 / Galaxy A03 Core', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A02s / Galaxy A02 / Galaxy A01 Core / Galaxy A01', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A9 (2018 Quad-Camera) / Galaxy A9 Pro', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A8+ (2018) / Galaxy A8 (2018) / Galaxy A8 Star', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A7 (2018 Triple Cam) / Galaxy A7 (2017) / A7 (2016)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A6+ (2018) / Galaxy A6 (2018)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A5 (2017 Water Resistant) / A5 (2016) / A5 (2015)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy A3 (2017) / Galaxy A3 (2016) / A3 (2015)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Galaxy J Series (Free Fire Historic Legends)
        { name: 'Galaxy J8 / Galaxy J8 Plus (Infinity Display)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy J7 Pro / Galaxy J7 Prime 2 / Galaxy J7 Prime', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy J7 Max / Galaxy J7 Duo (Dual Camera) / Galaxy J7 Nxt', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy J7 (2017) / Galaxy J7 (2016) / Galaxy J7 (2015)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy J6+ / Galaxy J6 (2018 AMOLED)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy J5 Pro / Galaxy J5 Prime', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy J5 (2017) / Galaxy J5 (2016) / Galaxy J5 (2015)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy J4+ / Galaxy J4 / Galaxy J4 Core', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy J3 Pro / Galaxy J3 (2017) / Galaxy J3 (2016)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy J2 Pro / Galaxy J2 Prime / Galaxy J2 Core', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy J2 (2018) / Galaxy J2 (2016 Smart Glow) / J2 (2015)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Galaxy J1 Ace / Galaxy J1 Mini Prime / Galaxy J1 (2016)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Galaxy M & F Series
        { name: 'Galaxy M55 5G / Galaxy M54 5G (6000mAh 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Galaxy M53 5G (108MP 120Hz) / Galaxy M52 5G (120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Galaxy M51 (7000mAh Battery King)', refreshRate: 60, baseDpi: 384, chipsetTier: 'mid' },
        { name: 'Galaxy M35 5G / Galaxy M34 5G (6000mAh 120Hz)', refreshRate: 120, baseDpi: 384, chipsetTier: 'mid' },
        { name: 'Galaxy M33 5G / Galaxy M32 5G / Galaxy M32 4G (90Hz)', refreshRate: 120, baseDpi: 384, chipsetTier: 'mid' },
        { name: 'Galaxy M31s / Galaxy M31 / Galaxy M30s (6000mAh) / M30', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy M23 5G / Galaxy M22 (90Hz) / Galaxy M21 / M20', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy M15 5G (90Hz Super AMOLED) / M14 5G / M13 / M12', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy M11 / Galaxy M10 / Galaxy M04 / Galaxy M02 / M01', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy F54 5G / Galaxy F34 5G / Galaxy F23 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Galaxy F14 5G / Galaxy F13 / Galaxy F04', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        // Historic Grand, Core, On, Ace & Legacy
        { name: 'Galaxy Grand Prime Plus / Galaxy Grand Prime', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Galaxy Grand 2 / Galaxy Grand Neo / Galaxy Grand (2012)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Galaxy Core Prime / Galaxy Core 2 / Galaxy Core (2013)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Galaxy On8 / Galaxy On7 Pro / Galaxy On6 / Galaxy On5', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy C9 Pro (6GB RAM Pioneer) / Galaxy C7 Pro / Galaxy C5', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy E7 / Galaxy E5 (2015)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy Alpha (First Metal Edge Galaxy 2014)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Galaxy Mega 6.3 / Galaxy Mega 5.8 (2013)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Galaxy Ace 4 / Galaxy Ace 3 / Galaxy Ace 2 / Galaxy Ace (2011)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Galaxy Y / Galaxy Y Duos / Galaxy Pocket / Galaxy Star (2011-2013)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'Xiaomi',
      models: [
        // Modern Flagships
        { name: 'Xiaomi 15 Pro / Xiaomi 15 (Snapdragon 8 Elite)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Xiaomi 14 Ultra (Quad Leica 50MP)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Xiaomi 14 Pro / Xiaomi 14', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Xiaomi 13T Pro (144Hz AMOLED Dimensity 9200+)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Xiaomi 13T (144Hz AMOLED Leica)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Xiaomi 13 Ultra (Leica Quad 1-inch)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Xiaomi 13 Pro / Xiaomi 13', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Xiaomi 13 Lite', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Xiaomi 12T Pro (200MP) / Xiaomi 12T', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Xiaomi 12 Pro / Xiaomi 12 / Xiaomi 12X', refreshRate: 120, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'Xiaomi 12 Lite', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Xiaomi 11T Pro (120W HyperCharge) / Xiaomi 11T', refreshRate: 120, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'Xiaomi 11 Lite 5G NE / Mi 11 Lite', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        // Historic Mi Series (From Mi 1 to Mi 11)
        { name: 'Mi 11 Ultra (Dual Screen Ceramic) / Mi 11 Pro', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Mi 11 / Mi 11i / Mi 11X Pro / Mi 11X', refreshRate: 120, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'Mi 10T Pro 5G (144Hz AdaptiveSync) / Mi 10T 5G', refreshRate: 144, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'Mi 10T Lite 5G (120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Mi 10 Ultra (120x Zoom 120Hz) / Mi 10 Pro / Mi 10 5G', refreshRate: 90, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'Mi 10 Youth 5G / Mi 10 Lite', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Mi 9T Pro (K20 Pro Global Pop-up) / Mi 9T', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Mi 9 / Mi 9 Pro 5G / Mi 9 SE / Mi 9 Lite', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Mi 8 Pro / Mi 8 (IR Face Unlock) / Mi 8 Explorer / Mi 8 SE', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Mi 8 Lite', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Mi 6 / Mi 6X (Dual Camera 2017)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Mi 5s Plus / Mi 5s (Ultrasonic Fingerprint) / Mi 5 / Mi 5c', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Mi 4 / Mi 4i / Mi 4c (Stainless Steel 2014)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Mi 3 (Tegra 4 / Snapdragon 800 2013)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Mi 2S / Mi 2 / Mi 2A (2012)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Mi 1 / Mi 1S (Company Inception First Phone Aug 2011)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Mi MIX, Max, Note & Android One
        { name: 'Xiaomi MIX Fold 3 / MIX Fold 2 / MIX Fold', refreshRate: 120, baseDpi: 420, chipsetTier: 'flagship' },
        { name: 'Mi MIX 4 (CUP Full Screen 120Hz)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Mi MIX 3 5G / Mi MIX 3 (Magnetic Slider) / MIX 2S / MIX 2', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Mi MIX (Original Ceramic Bezel-less Pioneer 2016)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Mi Max 3 / Mi Max 2 / Mi Max (Monster Screen 5500mAh)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Mi Note 10 Pro / Mi Note 10 (World First 108MP Penta Cam 2019)', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Mi Note 3 / Mi Note 2 (3D Dual-Curved OLED) / Mi Note', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Mi A3 / Mi A2 / Mi A2 Lite / Mi A1 (Google Android One)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Mi Play', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'Redmi',
      models: [
        // Note 13 Series
        { name: 'Redmi Note 13 Pro+ 5G (Curved 120Hz Dimensity 7200)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Redmi Note 13 Pro 5G (Snapdragon 7s Gen 2)', refreshRate: 120, baseDpi: 440, chipsetTier: 'mid' },
        { name: 'Redmi Note 13 Pro 4G (200MP 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Redmi Note 13 5G (120Hz AMOLED)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 13 4G / Redmi Note 13R Pro', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        // Note 12 Series
        { name: 'Redmi Note 12 Turbo (Snapdragon 7+ Gen 2 Flagship)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Redmi Note 12 Pro+ 5G (200MP OIS 120W)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 12 Pro 5G / Redmi Note 12 Pro 4G', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 12 5G / Redmi Note 12 4G / Redmi Note 12S', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 12R Pro / Redmi Note 12R', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        // Note 11 Series
        { name: 'Redmi Note 11 Pro+ 5G (120W HyperCharge)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 11 Pro 5G / Redmi Note 11 Pro 4G', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 11S 5G / Redmi Note 11S 4G (108MP)', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 11 4G / Note 11T 5G / Note 11SE', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        // Note 10 Series
        { name: 'Redmi Note 10 Pro Max (108MP 120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 10 Pro (120Hz Super AMOLED)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 10S / Redmi Note 10 5G / Redmi Note 10 4G', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Redmi Note 10T 5G / Redmi Note 10 JE', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        // Note 9 & Note 8 Series
        { name: 'Redmi Note 9 Pro Max / Redmi Note 9 Pro 5G', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 9 Pro / Redmi Note 9S', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Redmi Note 9 4G / Redmi Note 9T 5G', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Redmi Note 8 Pro (Helio G90T Gaming Monster)', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi Note 8 (2021) / Redmi Note 8 / Redmi Note 8T', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        // Note 7 down to Note 1 (Series Inception 2014)
        { name: 'Redmi Note 7 Pro (48MP Sony) / Redmi Note 7 / Note 7S', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Redmi Note 6 Pro (Dual Front & Rear AI)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Redmi Note 5 Pro / Redmi Note 5 AI / Redmi Note 5', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Redmi Note 4X / Redmi Note 4 (Snapdragon 625 Legend)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Redmi Note 3 Pro / Redmi Note 3 (First Metal Unibody)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi Note 2 / Redmi Note 2 Prime (2015)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi Note 4G / Redmi Note (Original Series Inception 2014)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Redmi K Gaming Series (China/Global Flagships)
        { name: 'Redmi K70 Pro (Snapdragon 8 Gen 3) / K70 Ultra / K70', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Redmi K60 Pro / Redmi K60 Ultra / Redmi K60', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Redmi K50 Gaming (Magnetic Triggers) / K50 Pro', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Redmi K40 Gaming (Sound by JBL) / K40 Pro+ / K40 Pro / K40', refreshRate: 120, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'Redmi K30 Pro / Redmi K30 5G (120Hz Pioneer) / K30 4G', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Redmi K20 Pro (Pop-up Demon King Alpha) / Redmi K20', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        // Redmi Number Series (From Redmi 13 down to Redmi 1 2013)
        { name: 'Redmi 13 4G / Redmi 13C 5G / Redmi 13C 4G', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi 12 5G (Snapdragon 4 Gen 2) / Redmi 12 4G / 12C', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi 11 Prime 5G / Redmi 11 Prime / Redmi 10 5G', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi 10 2022 / Redmi 10 Prime / Redmi 10C / Redmi 10A', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi 9 / Redmi 9 Prime / Redmi 9 Power / Redmi 9T / 9C / 9A', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi 8 / Redmi 8A Pro / Redmi 8A Dual / Redmi 8A', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi 7 / Redmi 7A / Redmi Y3 (32MP Selfie)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi 6 Pro (Notch) / Redmi 6 / Redmi 6A / S2 (Y2)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi 5 Plus / Redmi 5 / Redmi 5A / Redmi Y1', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi 4 / Redmi 4X / Redmi 4A / Redmi 3S Prime / 3S / 3 Pro', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Redmi 2 Prime / Redmi 2 (2015)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Redmi 1S / Redmi 1 (Brand Inception First Phone July 2013)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Redmi A3x / Redmi A3 / Redmi A2+ / Redmi A2 / A1+ / A1 / Go', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'POCO',
      models: [
        // F Series (Flagship Killers F1 to F6)
        { name: 'POCO F6 Pro (WQHD+ 120Hz Snapdragon 8 Gen 2)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'POCO F6 (Snapdragon 8s Gen 3 120Hz)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'POCO F5 Pro (WQHD+ 120Hz AMOLED)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'POCO F5 5G (Snapdragon 7+ Gen 2 FF Legend)', refreshRate: 120, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'POCO F4 GT (Magnetic Cyber Triggers 120W)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'POCO F4 5G (E4 AMOLED 120Hz OIS)', refreshRate: 120, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'POCO F3 GT (Maglev Triggers 120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'POCO F3 5G (Snapdragon 870 King of Stability)', refreshRate: 120, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'POCO F2 Pro (Full Screen Pop-up AMOLED)', refreshRate: 60, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'POCOPHONE F1 (Legendary Brand Inception 2018 LiquidCool)', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        // X Series (Performance Speedsters X2 to X6)
        { name: 'POCO X6 Pro 5G (Dimensity 8300-Ultra WildBoost)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'POCO X6 5G / POCO X6 Neo (120Hz AMOLED)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'POCO X5 Pro 5G (Snapdragon 778G 108MP)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'POCO X5 5G (120Hz Super AMOLED)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'POCO X4 GT (144Hz Low-Latency Gaming)', refreshRate: 144, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'POCO X4 Pro 5G (108MP 120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'POCO X3 Pro (Snapdragon 860 Free Fire God)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'POCO X3 NFC / POCO X3 GT (Dimensity 1100 120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'POCO X2 (120Hz RealityFlow Pioneer 2020)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        // M & C Series
        { name: 'POCO M6 Pro 5G / POCO M6 Pro 4G (120Hz Flow AMOLED)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'POCO M6 5G / POCO M6 Plus 5G (108MP)', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'POCO M5s (AMOLED) / POCO M5 (Helio G99 90Hz)', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'POCO M4 Pro 5G / POCO M4 Pro 4G (90Hz AMOLED)', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'POCO M4 5G', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'POCO M3 Pro 5G (90Hz) / POCO M3 (6000mAh Stereo)', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'POCO M2 Pro / POCO M2 / POCO M2 Reloaded', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'POCO C65 / POCO C61 / POCO C55', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'POCO C51 / POCO C50 / POCO C40 / POCO C31 / POCO C3', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'Realme',
      models: [
        // GT Flagship Series
        { name: 'Realme GT 6 / GT 6T (Snapdragon 8s Gen 3 6000 nits)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Realme GT 5 Pro (Periscope 8 Gen 3) / GT 5 (240W)', refreshRate: 144, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Realme GT Neo 6 / Neo 6 SE', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Realme GT Neo 5 (240W HyperCharge RGB) / Neo 5 SE', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Realme GT Neo 3 (150W UltraDart) / Neo 3T (870)', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Realme GT Neo 2 / Neo 2T', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Realme GT 2 Pro (2K LTPO 2.0 Paper) / GT 2', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Realme GT Master Edition / GT Explorer Master', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Realme GT 5G (Snapdragon 888 Original Racing Yellow 2021)', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        // Number Series (13 down to Realme 1 2018)
        { name: 'Realme 13 Pro+ 5G / 13 Pro 5G (Monet Design)', refreshRate: 120, baseDpi: 440, chipsetTier: 'mid' },
        { name: 'Realme 12 Pro+ 5G (Periscope OIS 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Realme 12 Pro 5G / 12+ 5G / 12 5G / 12x 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Realme 11 Pro+ 5G (200MP Curved 120Hz) / 11 Pro 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Realme 11 5G / 11 4G / 11x 5G', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Realme 10 Pro+ 5G (Curved 120Hz 2160Hz PWM) / 10 Pro 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Realme 10 4G (90Hz Super AMOLED) / 10 5G / 10s', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Realme 9 Pro+ 5G (Sony IMX766 OIS) / 9 Pro 5G (120Hz)', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Realme 9 5G (120Hz) / 9 4G (108MP) / 9i 5G / 9i', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Realme 8 Pro (108MP) / 8 5G / 8 4G (Super AMOLED)', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Realme 8s 5G / 8i (120Hz Ultra Smooth Display)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Realme 7 Pro (65W SuperDart AMOLED) / 7 5G / 7 (90Hz) / 7i', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Realme 6 Pro (Dual Selfie 90Hz) / 6 / 6i / 6s', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Realme 5 Pro (48MP Quad) / 5 / 5s / 5i (5000mAh Battery)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme 3 Pro (Snapdragon 710) / 3 / 3i', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme 2 Pro (Dewdrop Notch) / Realme 2', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme 1 (Brand Inception First Phone May 2018 Diamond Black)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        // Narzo Gaming Series
        { name: 'Realme Narzo 70 Pro 5G (Horizon Glass 120Hz) / 70x 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Realme Narzo 60 Pro 5G (Curved 120Hz) / Narzo 60 5G / 60x 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Realme Narzo 50 Pro 5G / Narzo 50 5G / Narzo 50 (120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Realme Narzo 50A Prime / Narzo 50A / Narzo 50i Prime', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme Narzo 30 Pro 5G (120Hz Dimensity) / Narzo 30 5G / 30 4G', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Realme Narzo 20 Pro (65W Dart Helio G95) / Narzo 20 / 20A', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme Narzo 10 / Narzo 10A (2020 Gaming Series Launch)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        // C-Series (Budget Battery Champions)
        { name: 'Realme C67 5G (120Hz) / Realme C67 4G (108MP 33W)', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme C65 5G (120Hz) / Realme C65 4G / Realme C63 (45W)', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme C55 (Mini Capsule 90Hz) / C53 (108MP) / C51 (33W)', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme C35 (FHD+ Design) / C33 / C31 / C30s / C30', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme C25s (Helio G85) / C25 / C25Y / C21Y / C21 / C20', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme C17 (90Hz) / C15 (6000mAh) / C12 / C11 (2021) / C11', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Realme C3 (First Helio G70 2020) / Realme C2 / Realme C1 (2018)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        // X & U Historic Series
        { name: 'Realme X7 Max 5G (Dimensity 1200 120Hz) / X7 Pro / X7', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Realme X50 Pro 5G / X50 5G (120Hz) / X3 SuperZoom (60x Zoom) / X3', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Realme X2 Pro (90Hz Snapdragon 855+ 50W 2019) / X2 / XT', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Realme X (Pop-up AMOLED 2019) / Realme U1 (Selfie Pro 2018)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'OPPO',
      models: [
        // Find Flagship Series (From Find 5 to Find X7)
        { name: 'Find X7 Ultra (Dual Periscope Hasselblad) / Find X7', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Find X6 Pro (1-inch Sensor) / Find X6', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Find X5 Pro (MariSilicon X Ceramic) / Find X5', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Find X3 Pro (1 Billion Color Microscope) / Find X3 Neo / Find X3 Lite', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Find X2 Pro (120Hz 3K QHD+ 2020) / Find X2', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Find X (Iconic Motorized Stealth 3D Glass 2018)', refreshRate: 60, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'Find 7 / Find 7a (First VOOC Flash Charge 2014)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Find 5 (Company Inception First 1080p Flagship 2012)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Find N3 / Find N3 Flip / Find N2 Flip (Foldables)', refreshRate: 120, baseDpi: 420, chipsetTier: 'flagship' },
        // Reno Series (12 down to Original Reno 2019 Shark Fin)
        { name: 'Reno 12 Pro / Reno 12 / Reno 12F (AI Portrait)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Reno 11 Pro 5G / Reno 11 5G / Reno 11 F 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Reno 10 Pro+ 5G (Snapdragon 8+ Gen 1 Periscope) / 10 Pro / 10', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Reno 9 Pro+ / Reno 9 Pro / Reno 9', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Reno 8 Pro 5G / Reno 8 5G / Reno 8T 5G (108MP) / 8T 4G', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Reno 7 Pro 5G / Reno 7 5G / Reno 7 4G (Microscope) / 7Z 5G', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Reno 6 Pro 5G / Reno 6 5G (Glow Design) / Reno 6Z 5G', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Reno 5 Pro 5G / Reno 5 5G / Reno 5 4G / 5 Lite', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Reno 4 Pro (90Hz 3D Curved) / Reno 4 5G / Reno 4 4G / 4F', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Reno 3 Pro (World First 44MP Dual Punch-Hole) / Reno 3', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Reno 2 / Reno 2F / Reno 2Z (Quad Cam Shark Fin)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Reno 10x Zoom (Periscope) / Reno (Shark-Fin Pop-up 2019)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        // F Series (Selfie & Performance Experts F25 to F1)
        { name: 'OPPO F25 Pro 5G (4K Ultra-Clear HDR 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'OPPO F23 5G (67W SUPERVOOC 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'OPPO F21 Pro 5G / F21s Pro (Microlens) / F21 Pro 4G', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'OPPO F19 Pro+ 5G / F19 Pro / F19 / F19s', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'OPPO F17 Pro (Sleek 7.48mm Ultra-Thin) / F17', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'OPPO F15 (AMOLED Game Boost 2.0)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'OPPO F11 Pro (Rising Panoramic Screen) / F11 (48MP)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'OPPO F9 Pro (Waterdrop Screen VOOC) / F9', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OPPO F7 / F7 Youth (AI 25MP Selfie 2018)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OPPO F5 / F5 Youth (18:9 FullScreen AI 2017)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OPPO F3 Plus / F3 (One for Selfie One for Group 2017)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OPPO F1s / F1 Plus / F1 (Original Selfie Expert 2016)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // A & K Series
        { name: 'OPPO A98 5G (120Hz 67W) / A79 5G (FHD+ 90Hz) / A78 5G / A78 4G', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'OPPO A77s / A77 5G / A76 / A74 5G / A74 4G (AMOLED)', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'OPPO A58 4G / A57 4G / A55 / A54 / A53 (90Hz Pioneer)', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OPPO A38 (90Hz 33W) / A18 / A17 / A17k / A16 / A15s / A15', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OPPO A9 2020 (Dolby Atmos 5000mAh) / A5 2020 / A31', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OPPO A83 / A71 / A57 (2016) / A39 / A37 (2016 Historic Legend)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'OPPO A33 / A31 (2015) / Joy 3 / Neo 7 / Neo 5 / Mirror 5', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'OPPO K12 / K11 5G / K10 5G / K9 Pro / K3 (Pop-up) / K1', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'OPPO R17 Pro (SuperVOOC) / R17 / R15 Pro / R11s / R11 / R9s / R7s', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'Vivo',
      models: [
        // Flagship X-Series (From X1 to X100)
        { name: 'Vivo X100 Ultra / X100 Pro (Zeiss APO 200MP)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Vivo X100 / X90 Pro+ (1-inch Sony IMX989) / X90 Pro', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Vivo X90 / X80 Pro (Snapdragon 8 Gen 1) / X80', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Vivo X70 Pro+ (Micro-Gimbal V1) / X70 Pro / X70', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Vivo X60 Pro+ / X60 Pro (Gimbal 2.0 120Hz) / X60', refreshRate: 120, baseDpi: 392, chipsetTier: 'flagship' },
        { name: 'Vivo X50 Pro (World First Micro-Gimbal) / X50', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Vivo X27 Pro / X27 (Pop-up) / X23 / X21 (In-Display Fingerprint Pioneer 2018)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Vivo X20 / X9s / X9 (Dual Selfie 2016) / X7 / X6 / X5 Pro / Xplay 6', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo X1 (World Thinnest 6.55mm & First Hi-Fi Phone 2012 Inception)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // V-Series (V30 down to V1 2015)
        { name: 'Vivo V30 Pro (Zeiss Optics) / V30 (Aura Light) / V30e / V30 Lite', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Vivo V29 Pro / V29 5G (Smart Aura Light 120Hz) / V29e', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Vivo V27 Pro / V27 5G (Color Changing 120Hz) / V27e', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Vivo V25 Pro / V25 5G (Color Changing Glass) / V25e', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Vivo V23 Pro / V23 5G (Color Changing Fluorite AG) / V23e', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Vivo V21 5G (44MP OIS Dual Selfie) / V21e 5G / V21e', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Vivo V20 Pro 5G / V20 (Eye Autofocus 44MP) / V20 SE', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo V19 (Dual iView Punch-Hole) / V17 Pro (Dual Pop-up) / V17', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo V15 Pro (Pop-up Selfie 48MP) / V15 (Pop-up)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo V11 Pro (In-Display Fingerprint Halo) / V11 / V11i', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo V9 / V9 Youth (Notch FullView 2018)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo V7+ / V7 (18:9 FullView 24MP 2017)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo V5s / V5 Plus (Dual Bokeh Front Cam 2016) / V5', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Vivo V3 Max / V3 / V1 / V1 Max (2015 Series Inception)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Y Series (Historic & Modern Budget Champions)
        { name: 'Vivo Y200 Pro (3D Curved 120Hz) / Y200 5G / Y200e 5G / Y100 5G', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Vivo Y78 5G / Y75 5G / Y75 4G / Y56 5G', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Vivo Y36 5G / Y36 4G (90Hz) / Y35 (90Hz) / Y33s / Y30', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Vivo Y28 5G / Y27 5G / Y27 4G / Y22 / Y21s / Y21', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Vivo Y20s / Y20G (Helio G80) / Y20 / Y20i / Y19 / Y17 (5000mAh) / Y15', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo Y12s / Y12 / Y11 (2019) / Y11 (2014)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo Y95 / Y93 / Y91 / Y91i / Y91c (Halo FullView)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo Y85 / Y83 Pro / Y83 / Y81 / Y71 (2018)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Vivo Y69 / Y66 / Y55s / Y53 / Y51 (2015-2017)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Vivo Y31 / Y28 / Y22 (2014) / Y15 (2013 Inception)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Vivo Y03 / Y02t / Y02s / Y02 / Y01', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        // T-Series
        { name: 'Vivo T3 Pro 5G / T3 5G (Sony OIS 120Hz) / T3x 5G (6000mAh 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Vivo T2 Pro 5G (Curved 120Hz) / T2 5G / T2x 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Vivo T1 Pro 5G / T1 5G (120Hz) / T1 44W / T1x', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        // iQOO Gaming Brand (All Generations)
        { name: 'iQOO 12 Pro / iQOO 12 (144Hz Snapdragon 8 Gen 3 Q1 Chip)', refreshRate: 144, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'iQOO 11 Pro (200W FlashCharge) / iQOO 11 5G (2K 144Hz E6)', refreshRate: 144, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'iQOO 10 Pro (World First 200W Charge) / iQOO 10 / 9T', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'iQOO 9 Pro (Gimbal 2K 120Hz) / iQOO 9 / iQOO 9 SE', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'iQOO 8 Pro / iQOO 8 / iQOO 7 Legend (BMW M Stripes 120Hz) / 7', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'iQOO 3 5G (Monster Touch Buttons 2020)', refreshRate: 60, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'iQOO Pro 5G / iQOO Original (Brand Inception March 2019)', refreshRate: 60, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'iQOO Neo 9 Pro (144Hz) / Neo 8 Pro / Neo 7 Pro / Neo 6 (870)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'iQOO Z9 Turbo / Z9 5G (120Hz) / Z7 Pro 5G / Z7 / Z6 Pro / Z6', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
      ],
    },
    {
      brand: 'OnePlus',
      models: [
        // Flagships (From OnePlus One to OnePlus 12)
        { name: 'OnePlus 12 (Snapdragon 8 Gen 3 120Hz 4500 nits)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'OnePlus 12R (Trinity Engine 1.5K 120Hz LTPO)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'OnePlus 11 5G / OnePlus 11R 5G (Hasselblad)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'OnePlus 10 Pro 5G / OnePlus 10T 5G (150W SuperVOOC) / 10R', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'OnePlus 9 Pro 5G / OnePlus 9 5G / 9RT 5G / 9R 5G', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'OnePlus 8T (Cyberpunk 120Hz) / OnePlus 8 Pro (120Hz QHD+) / 8', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'OnePlus 7T Pro / OnePlus 7T (90Hz Fluid AMOLED 2019)', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'OnePlus 7 Pro (Iconic Bezel-less Pop-up 90Hz) / OnePlus 7', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'OnePlus 6T (McLaren Edition In-Screen Unlock) / OnePlus 6', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'OnePlus 5T (18:9 Optic AMOLED) / OnePlus 5', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'OnePlus 3T / OnePlus 3 (Dash Charge Pioneer 2016)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OnePlus X (Ceramic & Onyx Edition 2015)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OnePlus 2 (Flagship Killer 2016 Type-C Pioneer)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OnePlus One (The Legend "Never Settle" Cyanogen April 2014)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'OnePlus Open Foldable (120Hz Dual ProXDR)', refreshRate: 120, baseDpi: 420, chipsetTier: 'flagship' },
        // Nord Series (All Editions)
        { name: 'OnePlus Nord 4 5G (Metal Unibody 120Hz)', refreshRate: 120, baseDpi: 440, chipsetTier: 'mid' },
        { name: 'OnePlus Nord 3 5G (Dimensity 9000 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'OnePlus Nord 2T 5G / OnePlus Nord 2 5G (Pac-Man Edition)', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'OnePlus Nord (Original July 2020)', refreshRate: 90, baseDpi: 411, chipsetTier: 'entry' },
        { name: 'OnePlus Nord CE 4 5G (100W 120Hz) / CE 4 Lite 5G', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'OnePlus Nord CE 3 5G / OnePlus Nord CE 3 Lite 5G (108MP)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'OnePlus Nord CE 2 5G / OnePlus Nord CE 2 Lite / CE 5G', refreshRate: 90, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'OnePlus Nord N30 5G / N20 5G (AMOLED) / N200 5G / N10 5G / N100', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'Infinix',
      models: [
        // GT Series (Esports Cyber Gaming)
        { name: 'Infinix GT 20 Pro 5G (144Hz Gaming Flagship Pixelworks)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Infinix GT 10 Pro 5G (Cyber Mecha LED 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        // Note Series (From Note 2 to Note 40)
        { name: 'Infinix Note 40 Pro+ 5G (100W All-Round FastCharge 120Hz)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Infinix Note 40 Pro 5G / Note 40 Pro 4G / Note 40', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Infinix Note 30 VIP (68W Fast + 50W Wireless 120Hz) / 30 Pro', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Infinix Note 30 5G / Note 30 4G / Note 30i', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Infinix Note 12 VIP (120W HyperCharge 120Hz AMOLED)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Infinix Note 12 Pro 5G / Note 12 Pro 4G (Helio G99)', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Infinix Note 12 G96 / Note 12 G88 / Note 12 2023', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Infinix Note 11 Pro (120Hz) / Note 11 / Note 11s', refreshRate: 120, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Infinix Note 10 Pro (90Hz) / Note 10', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Infinix Note 8 / Note 8i (Helio G80)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Infinix Note 7 / Note 7 Lite (2020)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Infinix Note 6 (X Pen) / Note 5 Stylus / Note 5 (Android One 2018)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Infinix Note 4 Pro / Note 4 / Note 3 / Note 2 (2015 Series Inception)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Hot Series (From Hot 2 to Hot 40)
        { name: 'Infinix Hot 40 Pro (120Hz Helio G99) / Hot 40 / Hot 40i', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Infinix Hot 30 5G / Hot 30 / Hot 30i / Hot 30 Play (6000mAh)', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Infinix Hot 20 5G / Hot 20s (120Hz) / Hot 20 Play / Hot 20', refreshRate: 120, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Infinix Hot 12 Pro / Hot 12 Play / Hot 12', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Infinix Hot 11S (Helio G88) / Hot 11 2022 / Hot 11 Play / Hot 11', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Infinix Hot 10S (90Hz) / Hot 10 Play / Hot 10T / Hot 10', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Infinix Hot 9 Pro / Hot 9 Play (6000mAh) / Hot 9', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Infinix Hot 8 / Hot 7 Pro / Hot 7 / Hot 6 Pro / Hot 6', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Infinix Hot 5 / Hot 4 / Hot 3 / Hot 2 (Android One 2015 Inception)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Zero Flagships & Smart Series
        { name: 'Infinix Zero 30 5G (144Hz 4K60 Front Video)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Infinix Zero 30 4G (120Hz AMOLED 2K)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Infinix Zero Ultra (200MP + 180W Thunder Charge 120Hz)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Infinix Zero 20 (60MP OIS Front) / Zero 5G 2023 / Zero 5G', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Infinix Zero X Pro (Periscope Moon Shot 120Hz) / Zero X Neo', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Infinix Zero 8 / Zero 6 Pro / Zero 5 / Zero 4 Plus / Zero 3 / Zero 2', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Infinix Smart 8 Pro / Smart 8 / Smart 8 Plus / Smart 7 HD / Smart 7', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Infinix Smart 6 Plus / Smart 6 / Smart 5 / Smart 4 Plus / Smart 3 Plus', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'Tecno',
      models: [
        // Pova Gaming Series
        { name: 'Tecno Pova 6 Pro 5G (120Hz Dynamic-Light Mecha Design)', refreshRate: 120, baseDpi: 420, chipsetTier: 'mid' },
        { name: 'Tecno Pova 6 / Tecno Pova 6 Neo (7000mAh Battery)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Tecno Pova 5 Pro 5G (Interactive LED) / Pova 5 (6000mAh 120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Tecno Pova 4 Pro (AMOLED 90Hz) / Pova 4', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Tecno Pova 3 (7000mAh 90Hz) / Pova 2 (7000mAh) / Pova 1 (6000mAh)', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Tecno Pova Neo 3 / Tecno Pova Neo 2 / Tecno Pova Neo', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        // Camon Series (Photography & Gaming)
        { name: 'Tecno Camon 30 Premier 5G (144Hz 1.5K LTPO PolarAce)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Tecno Camon 30 Pro 5G (144Hz Dimensity 8200)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Tecno Camon 30 5G / Tecno Camon 30 4G (120Hz AMOLED)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Tecno Camon 20 Premier 5G (Sensor-Shift RGBW) / 20 Pro 5G', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Tecno Camon 20 Pro / Tecno Camon 20 4G / Camon 20 Doodle', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Tecno Camon 19 Pro 5G / Camon 19 Pro (120Hz Slim 0.98mm Bezel)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Tecno Camon 19 Neo / Tecno Camon 19', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Tecno Camon 18 Premier (Gimbal OIS 120Hz) / 18P / 18 / 18i', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Tecno Camon 17 Pro (90Hz Helio G95) / Camon 17P / Camon 17', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Tecno Camon 16 Premier (Helio G90T) / Camon 16 Pro / Camon 16', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'Tecno Camon 15 Pro (Pop-up) / Camon 15 / Camon 12 Pro / 12', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Tecno Camon 11 Pro / Camon 11 / Camon X Pro / Camon X', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Tecno Camon CX / Camon C9 / Camon C8 (2015 Series Inception)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Spark & Phantom Series
        { name: 'Tecno Spark 20 Pro+ (120Hz AMOLED 3D Curved Helio G99 Ultimate)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Tecno Spark 20 Pro (120Hz Helio G99) / Spark 20 / 20C', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Tecno Spark 10 Pro / Spark 10 5G / Spark 10 / Spark 10C', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Tecno Spark 9 Pro / Spark 9T / Spark 9', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Tecno Spark 8 Pro / Spark 8T / Spark 8 / Spark 8C (90Hz)', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Tecno Spark 7 Pro (90Hz) / Spark 7T (6000mAh) / Spark 7', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Tecno Spark 6 / Spark 5 Pro / Spark 4 / Spark 3 Pro / Spark 2 / Spark K7 (2017)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Tecno Phantom V Fold / Phantom V Flip (120Hz Foldable)', refreshRate: 120, baseDpi: 420, chipsetTier: 'flagship' },
        { name: 'Tecno Phantom X2 Pro (World First Retractable Portrait) / X2 / X', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Tecno Phantom 9 / Phantom 8 / Phantom 6 Plus / Phantom 5', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Tecno Pop 8 (90Hz) / Pop 7 Pro / Pop 7 / Pop 6 Pro / Pop 5 LTE / Pop 4', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'Huawei & Honor',
      models: [
        // Huawei Pura & P Flagships (From Ascend P1 to Pura 70)
        { name: 'Huawei Pura 70 Ultra (Retractable 1-inch) / Pura 70 Pro / 70', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Huawei Mate 60 Pro+ / Mate 60 Pro / Mate 60 (Satellite Calling)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Huawei P60 Pro (XMAGE Variable Aperture) / P60', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Huawei Mate 50 Pro (Variable Aperture) / Mate 50', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Huawei P50 Pro / Huawei P50 Pocket / Huawei P50', refreshRate: 120, baseDpi: 420, chipsetTier: 'flagship' },
        { name: 'Huawei Mate 40 Pro+ / Mate 40 Pro / Mate 40 (Kirin 9000)', refreshRate: 90, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Huawei P40 Pro+ (Ceramic 90Hz) / P40 Pro / P40 / P40 Lite', refreshRate: 90, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Huawei Mate 30 Pro (Horizon Curved Display) / Mate 30', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Huawei P30 Pro (Periscope 50x Legend) / P30 / P30 Lite', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Huawei Mate 20 Pro (2K Curved) / Mate 20 X (7.2-inch Gaming) / Mate 20', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Huawei P20 Pro (First Triple Leica 2018 Twilight) / P20 / P20 Lite', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Huawei Mate 10 Pro / Mate 10 / Mate 9 / Mate 8 / Mate 7', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Huawei P10 Plus / P10 / P9 (First Dual Leica 2016) / P8 (2015)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Huawei Ascend P7 / Ascend P6 (World Thinnest 2013) / Ascend P1 (2012)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Huawei Nova & Y Series
        { name: 'Huawei Nova 12 Ultra / Nova 12 Pro / Nova 12 (120Hz)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Huawei Nova 11 Pro (Kunlun Glass) / Nova 11 / Nova 11i', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Huawei Nova 10 Pro (Dual Front 60MP) / Nova 10 / Nova 10 SE', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Huawei Nova 9 / Nova 9 SE / Nova 8 / Nova 8i (120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Huawei Nova 7i (Free Fire Global Legend) / Nova 7 Pro / Nova 7', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Huawei Nova 5T (Kirin 980 Flagship) / Nova 4 / Nova 3i / Nova 2i', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Huawei Nova Y91 (7000mAh) / Y90 / Y72 / Y70 (6000mAh)', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Huawei Y9a / Y9 Prime 2019 (Pop-up) / Y9 2019 / Y8p / Y8s', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Huawei Y7p / Y7a / Y7 Prime / Y6p / Y6 / Y5p / Y5 / Y3', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        // Honor (From Honor 3C to Honor 200)
        { name: 'Honor Magic 6 Pro (180MP Periscope LTPO) / Magic 5 Pro / Magic 4 Pro', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Honor 200 Pro / Honor 200 (Studio Harcourt 120Hz)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Honor 100 Pro / Honor 90 (200MP 3840Hz PWM) / Honor 90 Lite', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Honor 80 Pro / Honor 70 / Honor 60 / Honor 50 (120Hz OLED)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Honor 30 Pro+ / Honor 20 Pro / Honor 20 / Honor 10 / Honor 9 / Honor 8', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Honor X9b 5G (Ultra-Bounce Anti-Drop) / X9a 5G / X8b / X8a / X7b', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Honor 8X (Massive Seller 2018) / 7X / 6X / 5X / 4X / Honor 3C (2013)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'Motorola',
      models: [
        // Edge Series (144Hz & 165Hz Display Leaders)
        { name: 'Edge 50 Ultra (144Hz Pantone Certified)', refreshRate: 144, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Edge 50 Pro (144Hz TrueColor) / Edge 50 Fusion', refreshRate: 144, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Edge 40 Pro (165Hz Snapdragon 8 Gen 2)', refreshRate: 165, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Edge 40 (144Hz Endless Edge OLED) / Edge 40 Neo', refreshRate: 144, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Edge 30 Ultra (200MP 144Hz) / Edge 30 Pro (144Hz)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Edge 30 Fusion / Edge 30 (World Thinnest 5G 144Hz)', refreshRate: 144, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Edge 20 Pro (144Hz 50x Periscope) / Edge 20 / Edge 20 Lite', refreshRate: 144, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Motorola Edge+ / Motorola Edge (Curved Endless 2020)', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Razr 50 Ultra (165Hz Dual OLED) / Razr 40 Ultra (165Hz)', refreshRate: 165, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Razr 2022 / Razr 5G / Razr (Iconic Flip 2019)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        // Moto G Series (From Moto G1 to Moto G85)
        { name: 'Moto G85 5G (Curved 120Hz) / Moto G84 5G (OLED 120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Moto G73 5G / Moto G64 5G / Moto G54 5G (120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Moto G34 5G (120Hz Budget) / Moto G24 Power / Moto G24 / Moto G14', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Moto G82 5G (OIS 120Hz AMOLED) / Moto G72 (10-bit 120Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Moto G62 5G / Moto G52 (OLED) / Moto G42 / Moto G32 (90Hz)', refreshRate: 120, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Moto G60 (120Hz 108MP) / Moto G51 5G (120Hz) / Moto G40 Fusion', refreshRate: 120, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Moto G31 / Moto G22 (90Hz) / Moto G10 / Moto G9 Plus / G9 Play', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Moto G8 Power / Moto G8 Plus / Moto G7 Power / Moto G7 Plus', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Moto G6 Plus / Moto G6 / Moto G5 Plus / Moto G5 / Moto G4 Plus / Moto G4', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Moto G (3rd Gen 2015) / Moto G (2nd Gen 2014) / Moto G (1st Gen Legend 2013)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        // Moto X, Z, E & Droid
        { name: 'Moto X4 / Moto X Style / Moto X Force (ShatterShield) / Moto X (2013)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Moto Z4 / Moto Z3 Play / Moto Z2 Force / Moto Z (Modular Mods 2016)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Moto E14 / E13 / E32s / E22 / E7 Plus / E6s / E5 Plus / Moto E (2014 Inception)', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Droid Turbo 2 / Droid Turbo / Droid Maxx', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'Google Pixel & Nexus',
      models: [
        // Pixel Series (Pixel 1 to Pixel 9)
        { name: 'Pixel 9 Pro XL (120Hz Super Actua LTPO)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Pixel 9 Pro (120Hz Super Actua LTPO)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Pixel 9 (120Hz Actua Display)', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Pixel 9 Pro Fold (Dual 120Hz LTPO)', refreshRate: 120, baseDpi: 420, chipsetTier: 'flagship' },
        { name: 'Pixel 8 Pro (120Hz LTPO 2400 nits)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Pixel 8 (120Hz Actua Display)', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'Pixel 8a (120Hz Tensor G3)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Pixel Fold (Dual 120Hz)', refreshRate: 120, baseDpi: 420, chipsetTier: 'flagship' },
        { name: 'Pixel 7 Pro (120Hz LTPO Tensor G2)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Pixel 7 (90Hz Smooth Display)', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Pixel 7a (90Hz Wireless Charge)', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Pixel 6 Pro (120Hz Tensor First Gen)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Pixel 6 (90Hz)', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Pixel 6a (Google Tensor)', refreshRate: 60, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Pixel 5 (90Hz 5G Aluminum) / Pixel 5a 5G', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Pixel 4 XL (90Hz Smooth Display Soli Radar) / Pixel 4', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Pixel 4a 5G / Pixel 4a (Compact Legend)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Pixel 3 XL (Notch) / Pixel 3 / Pixel 3a XL / Pixel 3a', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Pixel 2 XL / Pixel 2', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'Pixel XL / Pixel (Original Google Flagship 2016)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        // Historic Google Nexus Series (2010 to 2015 - Android Inception)
        { name: 'Nexus 6P (Huawei All-Metal Flagship 2015)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Nexus 5X (LG Fingerprint 2015)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Nexus 6 (Motorola 5.96-inch Quad HD 2014)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Nexus 5 (LG Legendary Pure Android 2013)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Nexus 4 (LG Holographic Glass Back 2012)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Galaxy Nexus (Samsung HD Super AMOLED Curved 2011)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Nexus S (Samsung Contour Glass 2010)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
        { name: 'Nexus One (HTC / Google First Phone Jan 2010 Inception)', refreshRate: 60, baseDpi: 320, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'ASUS ROG & Gaming',
      models: [
        // ASUS ROG Phone (All 8 Generations)
        { name: 'ROG Phone 8 Pro (165Hz LTPO AniMe Matrix)', refreshRate: 165, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'ROG Phone 8 (165Hz LTPO Snapdragon 8 Gen 3)', refreshRate: 165, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'ROG Phone 7 Ultimate (165Hz AeroActive Portal)', refreshRate: 165, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'ROG Phone 7 (165Hz Snapdragon 8 Gen 2)', refreshRate: 165, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'ROG Phone 6 Pro / ROG Phone 6 (165Hz AMOLED)', refreshRate: 165, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'ROG Phone 6D Ultimate / 6D (Dimensity 9000+ 165Hz)', refreshRate: 165, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'ROG Phone 5s Pro / ROG Phone 5s (144Hz 360Hz Touch)', refreshRate: 144, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'ROG Phone 5 Ultimate / ROG Phone 5 (144Hz 300Hz Touch)', refreshRate: 144, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'ROG Phone 3 Strix / ROG Phone 3 (144Hz 2020)', refreshRate: 144, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'ROG Phone II (120Hz 1ms 6000mAh 2019 Monster)', refreshRate: 120, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'ROG Phone 1 (First 90Hz AMOLED Gaming Phone 2018 Inception)', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        // Nubia RedMagic (All 9 Generations)
        { name: 'RedMagic 9 Pro+ / 9 Pro (165Hz Flat Back 8 Gen 3)', refreshRate: 165, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'RedMagic 8S Pro+ / 8S Pro (Leading Version 3.36GHz)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'RedMagic 8 Pro+ / 8 Pro (Bezel-free UDC)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'RedMagic 7S Pro / 7S (165Hz ICE 10.0 Cooling)', refreshRate: 165, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'RedMagic 7 Pro / RedMagic 7 (165Hz 720Hz Touch)', refreshRate: 165, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'RedMagic 6S Pro (165Hz 720Hz Multi-finger) / 6 Pro', refreshRate: 165, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'RedMagic 6 / 6R (World First 165Hz Screen 2021)', refreshRate: 165, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'RedMagic 5S / 5G (World First 144Hz Phone 2020)', refreshRate: 144, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'RedMagic 3S / 3 (First Internal Centrifugal Fan 2019)', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'RedMagic Mars / RedMagic (Brand Inception 2018)', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        // Xiaomi Black Shark (All Generations)
        { name: 'Black Shark 5 Pro (144Hz Snapdragon 8 Gen 1 Maglev)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Black Shark 5 RS / Black Shark 5 (144Hz E4)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Black Shark 4S Pro / Black Shark 4 Pro (144Hz 720Hz Touch)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Black Shark 4 (144Hz Magnetic Pop-up Triggers)', refreshRate: 144, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Black Shark 3 Pro (7.1-inch 2K 90Hz Triggers) / 3S / 3', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Black Shark 2 Pro / Black Shark 2 (Master Touch 2019)', refreshRate: 60, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'Black Shark Helo (First 10GB RAM) / Black Shark 1 (Original 2018)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        // ASUS ZenFone Series
        { name: 'ZenFone 11 Ultra (144Hz LTPO) / ZenFone 10 (Compact 144Hz)', refreshRate: 144, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'ZenFone 9 (Compact 120Hz Gimbal) / ZenFone 8 / 8 Flip', refreshRate: 120, baseDpi: 411, chipsetTier: 'flagship' },
        { name: 'ZenFone 7 Pro / 7 (Motorized Flip Camera 90Hz)', refreshRate: 90, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'ZenFone 6 (Flip Camera 2019) / ZenFone 5Z / ZenFone 5', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'ZenFone Max Pro M2 / ZenFone Max Pro M1 (Free Fire Legend)', refreshRate: 60, baseDpi: 392, chipsetTier: 'entry' },
        { name: 'ZenFone 4 / ZenFone 3 / ZenFone 2 (First 4GB RAM 2015)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'Sony, LG, Nokia & itel',
      models: [
        // Sony Xperia
        { name: 'Sony Xperia 1 VI / 1 V / 1 IV (120Hz 4K OLED)', refreshRate: 120, baseDpi: 450, chipsetTier: 'flagship' },
        { name: 'Sony Xperia 5 V / 5 IV / 5 III (120Hz Compact)', refreshRate: 120, baseDpi: 440, chipsetTier: 'flagship' },
        { name: 'Sony Xperia 10 VI / 10 V / 10 IV', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Sony Xperia 1 III / 1 II / 1 (2019) / Xperia XZ3 / XZ2', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Sony Xperia Z5 Premium (First 4K) / Z5 / Z3 / Z2 / Z1 / Z (2013)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        // LG Mobile (Historic Pioneers)
        { name: 'LG Wing 5G (Swivel Screen 2020) / LG Velvet 5G', refreshRate: 60, baseDpi: 411, chipsetTier: 'mid' },
        { name: 'LG V60 ThinQ / V50 ThinQ / V40 ThinQ / V30 / V20 / V10', refreshRate: 60, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'LG G8 ThinQ / G7 ThinQ / G6 (First 18:9) / G5 (Modular) / G4 / G3 (First 1440p) / G2', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        // Nokia Android
        { name: 'Nokia XR21 / XR20 (Rugged) / Nokia X30 5G (90Hz)', refreshRate: 90, baseDpi: 392, chipsetTier: 'mid' },
        { name: 'Nokia G60 5G (120Hz) / G42 5G / G22 / G21 (90Hz) / G11', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Nokia 8.3 5G / 8.1 / 8 / 7 Plus / 6.2 / 6.1 / 6 (2017 Return)', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'Nokia C32 / C31 / C22 / C21 / C20 / C10 / C1', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
        // itel Budget Gaming
        { name: 'itel S24 (108MP 90Hz) / itel S23+ (3D Curved AMOLED)', refreshRate: 90, baseDpi: 384, chipsetTier: 'entry' },
        { name: 'itel P55 5G / itel P55+ (45W) / itel P55 (90Hz)', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'itel P40+ (7000mAh) / itel P40', refreshRate: 90, baseDpi: 360, chipsetTier: 'entry' },
        { name: 'itel Color Pro 5G / itel A70 / itel A60s / itel A60', refreshRate: 60, baseDpi: 360, chipsetTier: 'entry' },
      ],
    },
  ],
  iOS: [
    {
      brand: 'Apple',
      models: [
        // iPhone 16
        { name: 'iPhone 16 Pro Max (120Hz ProMotion)', refreshRate: 120, baseDpi: 460, chipsetTier: 'flagship' },
        { name: 'iPhone 16 Pro (120Hz ProMotion)', refreshRate: 120, baseDpi: 460, chipsetTier: 'flagship' },
        { name: 'iPhone 16 Plus', refreshRate: 60, baseDpi: 460, chipsetTier: 'flagship' },
        { name: 'iPhone 16', refreshRate: 60, baseDpi: 460, chipsetTier: 'flagship' },
        // iPhone 15
        { name: 'iPhone 15 Pro Max (120Hz ProMotion)', refreshRate: 120, baseDpi: 460, chipsetTier: 'flagship' },
        { name: 'iPhone 15 Pro (120Hz ProMotion)', refreshRate: 120, baseDpi: 460, chipsetTier: 'flagship' },
        { name: 'iPhone 15 Plus', refreshRate: 60, baseDpi: 460, chipsetTier: 'flagship' },
        { name: 'iPhone 15', refreshRate: 60, baseDpi: 460, chipsetTier: 'flagship' },
        // iPhone 14
        { name: 'iPhone 14 Pro Max (Dynamic Island 120Hz)', refreshRate: 120, baseDpi: 460, chipsetTier: 'flagship' },
        { name: 'iPhone 14 Pro (120Hz ProMotion)', refreshRate: 120, baseDpi: 460, chipsetTier: 'flagship' },
        { name: 'iPhone 14 Plus', refreshRate: 60, baseDpi: 460, chipsetTier: 'mid' },
        { name: 'iPhone 14', refreshRate: 60, baseDpi: 460, chipsetTier: 'mid' },
        // iPhone 13
        { name: 'iPhone 13 Pro Max (First 120Hz ProMotion)', refreshRate: 120, baseDpi: 460, chipsetTier: 'flagship' },
        { name: 'iPhone 13 Pro (120Hz ProMotion)', refreshRate: 120, baseDpi: 460, chipsetTier: 'flagship' },
        { name: 'iPhone 13', refreshRate: 60, baseDpi: 460, chipsetTier: 'mid' },
        { name: 'iPhone 13 mini', refreshRate: 60, baseDpi: 476, chipsetTier: 'mid' },
        // iPhone 12
        { name: 'iPhone 12 Pro Max', refreshRate: 60, baseDpi: 458, chipsetTier: 'mid' },
        { name: 'iPhone 12 Pro / 12', refreshRate: 60, baseDpi: 460, chipsetTier: 'mid' },
        { name: 'iPhone 12 mini', refreshRate: 60, baseDpi: 476, chipsetTier: 'mid' },
        // iPhone 11
        { name: 'iPhone 11 Pro Max', refreshRate: 60, baseDpi: 458, chipsetTier: 'mid' },
        { name: 'iPhone 11 Pro', refreshRate: 60, baseDpi: 458, chipsetTier: 'mid' },
        { name: 'iPhone 11', refreshRate: 60, baseDpi: 326, chipsetTier: 'mid' },
        // iPhone XS / XR / X
        { name: 'iPhone XS Max', refreshRate: 60, baseDpi: 458, chipsetTier: 'entry' },
        { name: 'iPhone XS', refreshRate: 60, baseDpi: 458, chipsetTier: 'entry' },
        { name: 'iPhone XR', refreshRate: 60, baseDpi: 326, chipsetTier: 'entry' },
        { name: 'iPhone X (10th Anniversary)', refreshRate: 60, baseDpi: 458, chipsetTier: 'entry' },
        // Historic iPhones (Down to 6s)
        { name: 'iPhone 8 Plus / 8', refreshRate: 60, baseDpi: 401, chipsetTier: 'entry' },
        { name: 'iPhone 7 Plus / 7', refreshRate: 60, baseDpi: 401, chipsetTier: 'entry' },
        { name: 'iPhone 6s Plus / 6s (Free Fire Minimum Support)', refreshRate: 60, baseDpi: 401, chipsetTier: 'entry' },
        { name: 'iPhone SE (3rd Gen 5G 2022) / SE (2nd Gen 2020)', refreshRate: 60, baseDpi: 326, chipsetTier: 'mid' },
        { name: 'iPad Pro 12.9 / 11 (120Hz ProMotion Free Fire Beast)', refreshRate: 120, baseDpi: 500, chipsetTier: 'flagship' },
        { name: 'iPad Air 5 / 4 / iPad Mini 6', refreshRate: 60, baseDpi: 460, chipsetTier: 'mid' },
      ],
    },
  ],
  PC: [
    {
      brand: 'ASUS ROG & TUF',
      models: [
        { name: 'ROG Strix SCAR 16 / 18 (240Hz)', refreshRate: 240, baseDpi: 1000, chipsetTier: 'flagship' },
        { name: 'ROG Zephyrus G14 / G16', refreshRate: 165, baseDpi: 1000, chipsetTier: 'flagship' },
        { name: 'TUF Gaming A15 / F15', refreshRate: 144, baseDpi: 800, chipsetTier: 'mid' },
      ],
    },
    {
      brand: 'Acer Nitro & Predator',
      models: [
        { name: 'Predator Helios 16 / 18', refreshRate: 240, baseDpi: 1000, chipsetTier: 'flagship' },
        { name: 'Nitro 5 / Nitro 16 Gaming', refreshRate: 144, baseDpi: 800, chipsetTier: 'mid' },
      ],
    },
    {
      brand: 'Lenovo Legion',
      models: [
        { name: 'Legion Pro 7i / 5i', refreshRate: 240, baseDpi: 1000, chipsetTier: 'flagship' },
        { name: 'Legion Slim 5', refreshRate: 165, baseDpi: 800, chipsetTier: 'mid' },
        { name: 'IdeaPad Gaming 3', refreshRate: 120, baseDpi: 800, chipsetTier: 'mid' },
      ],
    },
    {
      brand: 'MSI Gaming',
      models: [
        { name: 'MSI Raider GE78 / Titan GT77', refreshRate: 240, baseDpi: 1200, chipsetTier: 'flagship' },
        { name: 'MSI Katana 15 / Crosshair', refreshRate: 144, baseDpi: 800, chipsetTier: 'mid' },
        { name: 'MSI Thin GF63', refreshRate: 144, baseDpi: 800, chipsetTier: 'entry' },
      ],
    },
    {
      brand: 'HP Omen & Victus',
      models: [
        { name: 'HP Omen 16 / 17 Transcend', refreshRate: 240, baseDpi: 1000, chipsetTier: 'flagship' },
        { name: 'HP Victus 16 / 15', refreshRate: 144, baseDpi: 800, chipsetTier: 'mid' },
      ],
    },
    {
      brand: 'Dell Alienware',
      models: [
        { name: 'Alienware m16 / m18 R2', refreshRate: 240, baseDpi: 1200, chipsetTier: 'flagship' },
        { name: 'Dell G15 / G16 Gaming', refreshRate: 165, baseDpi: 800, chipsetTier: 'mid' },
      ],
    },
    {
      brand: 'Custom Emulator Desktop',
      models: [
        { name: 'BlueStacks 5 (Pie 64-bit Edition)', refreshRate: 144, baseDpi: 800, chipsetTier: 'mid' },
        { name: 'MSI App Player 4.280 Pro', refreshRate: 240, baseDpi: 1000, chipsetTier: 'flagship' },
        { name: 'LDPlayer 9 Low-Latency', refreshRate: 120, baseDpi: 800, chipsetTier: 'mid' },
        { name: 'SmartGaGa Lightweight Engine', refreshRate: 60, baseDpi: 600, chipsetTier: 'entry' },
      ],
    },
  ],
};

export interface GeneratedSensitivity {
  scaleMax: 200;
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniper: number;
  freeLook: number;
  fireButtonSize: number;
  recommendedDpi: number | string;
  graphicPreset: 'Smooth' | 'Standard' | 'Ultra' | 'MAX';
  fpsSetting: 'Normal' | 'High (60 FPS)' | 'Ultra (90 FPS)' | 'Max (120 FPS)';
  dragCurveExplanation: string;
  fingerPlacementTip: string;
}

// Deterministic seed based on device model string so every phone model has a unique, realistic calibration
function getModelSeed(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function calculateSensitivity(
  platform: Platform,
  device: DeviceModel,
  style: GamingStyle
): GeneratedSensitivity {
  const seed = getModelSeed(device.name);

  // Per-model micro-offsets so every single phone has distinct, customized numbers
  const offsetGen = (seed % 11) - 5;       // -5 to +5
  const offsetRed = ((seed >> 2) % 9) - 4; // -4 to +4
  const offset2x = ((seed >> 4) % 9) - 4;  // -4 to +4
  const offset4x = ((seed >> 6) % 9) - 4;  // -4 to +4
  const offsetSniper = ((seed >> 8) % 9) - 4; // -4 to +4
  const offsetFree = ((seed >> 3) % 11) - 5;  // -5 to +5
  const offsetBtn = ((seed >> 5) % 5) - 2;   // -2 to +2

  // Base values for modern Free Fire 0–200 scale based on screen refresh rate & touch polling physics
  let baseGeneral = 188;
  let baseRedDot = 180;
  let base2x = 168;
  let base4x = 156;
  let baseSniper = 92;
  let baseFreeLook = 158;
  let buttonSize = 46;
  let recommendedDpi: number | string = device.baseDpi;

  if (platform === 'Android') {
    if (device.refreshRate >= 144) {
      // Gaming phones (ROG, RedMagic, Black Shark) with 500Hz-1000Hz touch polling
      baseGeneral = 152 + offsetGen;
      baseRedDot = 146 + offsetRed;
      base2x = 138 + offset2x;
      base4x = 128 + offset4x;
      baseSniper = 78 + offsetSniper;
      baseFreeLook = 138 + offsetFree;
      buttonSize = 42 + offsetBtn;
    } else if (device.refreshRate >= 120) {
      // 120Hz Displays (Smooth drag flick, fast 240Hz-360Hz touch sampling)
      baseGeneral = 164 + offsetGen;
      baseRedDot = 158 + offsetRed;
      base2x = 148 + offset2x;
      base4x = 138 + offset4x;
      baseSniper = 84 + offsetSniper;
      baseFreeLook = 148 + offsetFree;
      buttonSize = 44 + offsetBtn;
    } else if (device.refreshRate >= 90) {
      // 90Hz Displays
      baseGeneral = 176 + offsetGen;
      baseRedDot = 170 + offsetRed;
      base2x = 160 + offset2x;
      base4x = 148 + offset4x;
      baseSniper = 88 + offsetSniper;
      baseFreeLook = 156 + offsetFree;
      buttonSize = 46 + offsetBtn;
    } else {
      // 60Hz Standard (Lower touch polling 120Hz-180Hz requires higher sensitivity for rapid drag acceleration)
      baseGeneral = 190 + offsetGen;
      baseRedDot = 184 + offsetRed;
      base2x = 174 + offset2x;
      base4x = 162 + offset4x;
      baseSniper = 96 + offsetSniper;
      baseFreeLook = 166 + offsetFree;
      buttonSize = 48 + offsetBtn;
    }

    // Chipset latency compensation
    if (device.chipsetTier === 'entry') {
      baseGeneral += 6;
      baseRedDot += 4;
      base2x += 3;
    } else if (device.chipsetTier === 'flagship') {
      baseGeneral -= 4;
      baseRedDot -= 3;
    }

    const tunedDpi = Math.min(device.baseDpi + (device.chipsetTier === 'flagship' ? 48 : 36), 490);
    recommendedDpi = `${tunedDpi} DPI (Stock: ${device.baseDpi})`;

  } else if (platform === 'iOS') {
    // Apple iOS (ProMotion 120Hz vs Standard 60Hz)
    if (device.refreshRate >= 120) {
      baseGeneral = 168 + offsetGen;
      baseRedDot = 162 + offsetRed;
      base2x = 154 + offset2x;
      base4x = 144 + offset4x;
      baseSniper = 82 + offsetSniper;
      baseFreeLook = 152 + offsetFree;
      buttonSize = 43 + offsetBtn;
    } else {
      baseGeneral = 186 + offsetGen;
      baseRedDot = 180 + offsetRed;
      base2x = 170 + offset2x;
      base4x = 160 + offset4x;
      baseSniper = 90 + offsetSniper;
      baseFreeLook = 164 + offsetFree;
      buttonSize = 45 + offsetBtn;
    }
    recommendedDpi = 'Stock iOS Touch Accommodations (0.10s hold duration, Fast Tracking)';

  } else if (platform === 'PC') {
    // PC Emulator (Mouse DPI 800-1200 + In-game 0-200 scale)
    baseGeneral = 92 + offsetGen;
    baseRedDot = 86 + offsetRed;
    base2x = 80 + offset2x;
    base4x = 72 + offset4x;
    baseSniper = 52 + offsetSniper;
    baseFreeLook = 75 + offsetFree;
    buttonSize = 12;
    recommendedDpi = 'Mouse 800 - 1000 DPI (Emulator X: 1.45, Y: 2.30)';
  }

  let dragCurve = '';
  let fingerTip = '';

  // Gaming Style Modifiers tuned specifically for 0–200 scale
  switch (style) {
    case 'One Tap':
      baseGeneral = Math.min(200, baseGeneral + 12);
      baseRedDot = Math.min(200, baseRedDot + 16);
      base2x = Math.min(200, base2x + 8);
      buttonSize = Math.max(36, buttonSize - 5);
      dragCurve = 'Fast upward J-drag stroke. Perfect for Desert Eagle, M1887, and Woodpecker instant headshots on 0-200 scale.';
      fingerTip = 'Position the fire button lower on screen to allow maximum vertical drag distance for instant red numbers.';
      break;

    case 'Drag Headshot':
      baseGeneral = Math.min(200, baseGeneral + 8);
      baseRedDot = Math.min(200, baseRedDot + 12);
      base2x = Math.min(200, base2x + 10);
      base4x = Math.min(200, base4x + 6);
      buttonSize = 43;
      dragCurve = 'Straight vertical drag flick when enemy is static; diagonal angle drag when target is strafing.';
      fingerTip = 'Swipe thumb smoothly from the center of the fire button directly towards the in-game head icon.';
      break;

    case 'Sniper':
      baseSniper = Math.min(200, baseSniper + 22);
      base4x = Math.min(200, base4x + 10);
      baseGeneral = Math.max(60, baseGeneral - 16);
      baseRedDot = Math.max(60, baseRedDot - 10);
      buttonSize = 50;
      dragCurve = 'Precision micro-aiming. Place the pet emote button in exact screen center for no-scope quick-switch alignment.';
      fingerTip = 'Bind quick weapon switch directly adjacent to the scope button for rapid AWM / Barrett double-sniping.';
      break;

    case 'Rusher':
      baseGeneral = Math.min(200, baseGeneral + 18);
      baseRedDot = Math.min(200, baseRedDot + 14);
      base2x = Math.min(200, base2x + 12);
      baseFreeLook = Math.min(200, baseFreeLook + 20);
      buttonSize = 40;
      dragCurve = 'Ultra-high twitch agility. Instant 180° turns and 0.08s rapid Gloo Wall deployment right after firing.';
      fingerTip = 'Keep crouch and Gloo Wall buttons within immediate reach of your left/right thumb for instant shield lock.';
      break;

    case 'Movement':
      baseGeneral = Math.min(200, baseGeneral + 20);
      baseFreeLook = Math.min(200, baseFreeLook + 25);
      baseRedDot = Math.min(200, baseRedDot + 12);
      buttonSize = 44;
      dragCurve = '360° fluid camera sweeps with zero friction. Prioritizes zig-zag sprinting and jump-shot momentum.';
      fingerTip = 'Set joystick size to 10% and tuck it in the bottom left corner to eliminate sprint cancellation.';
      break;

    case 'Balanced':
    default:
      dragCurve = 'All-round stability for both close-range SMG spray and long-range AR burst fire on 0-200 scale.';
      fingerTip = 'Standard natural resting arc for two-finger or three-finger claw layout.';
      break;
  }

  let graphicPreset: 'Smooth' | 'Standard' | 'Ultra' | 'MAX' = 'Standard';
  let fpsSetting: 'Normal' | 'High (60 FPS)' | 'Ultra (90 FPS)' | 'Max (120 FPS)' = 'High (60 FPS)';

  if (device.chipsetTier === 'flagship') {
    graphicPreset = device.refreshRate >= 120 ? 'Ultra' : 'MAX';
    fpsSetting = device.refreshRate >= 144 ? 'Max (120 FPS)' : device.refreshRate >= 90 ? 'Ultra (90 FPS)' : 'High (60 FPS)';
  } else if (device.chipsetTier === 'mid') {
    graphicPreset = 'Standard';
    fpsSetting = 'High (60 FPS)';
  } else {
    graphicPreset = 'Smooth';
    fpsSetting = 'High (60 FPS)';
  }

  return {
    scaleMax: 200,
    general: Math.min(200, Math.max(0, baseGeneral)),
    redDot: Math.min(200, Math.max(0, baseRedDot)),
    scope2x: Math.min(200, Math.max(0, base2x)),
    scope4x: Math.min(200, Math.max(0, base4x)),
    sniper: Math.min(200, Math.max(0, baseSniper)),
    freeLook: Math.min(200, Math.max(0, baseFreeLook)),
    fireButtonSize: Math.min(70, Math.max(10, buttonSize)),
    recommendedDpi,
    graphicPreset,
    fpsSetting,
    dragCurveExplanation: dragCurve,
    fingerPlacementTip: fingerTip,
  };
}

