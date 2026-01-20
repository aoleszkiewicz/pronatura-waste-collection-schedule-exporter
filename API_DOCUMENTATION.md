# ProNatura Waste Schedule API Documentation

This document describes the structure of the JSON API used by the ProNatura Bydgoszcz waste collection schedule system.

---

## 1. Streets List
**Endpoint:** `/streets`  
**Method:** `GET`

Returns an array of all available streets.

### Response Structure
```json
[
  {
    "id": "2d00c558-0b21-4905-8d29-9d9ad3f377e6",
    "street": "11 DYWIZJONU ARTYLERII KONNEJ"
  },
  ...
]
```
- `id` (String): UUID of the street.
- `street` (String): Full name of the street.

---

## 2. Address Points
**Endpoint:** `/address-points/{streetId}`  
**Method:** `GET`

Returns an array of building numbers for a specific street.

### Response Structure
```json
[
  {
    "id": "3e4c1cbc-c57f-4bde-aace-aa73fa1c278b",
    "buildingNumber": "14",
    "buildingType": "MIESZKALNA",
    "name": null
  },
  ...
]
```
- `id` (String): UUID of the specific address point.
- `buildingNumber` (String): The house/flat number (can be a range like "8,10,12").
- `buildingType` (String): Usually "MIESZKALNA" (Residential) or "NIEMIESZKALNA" (Non-residential).
- `name` (String|null): Additional description (e.g., name of a cooperative).

---

## 3. Trash Schedule
**Endpoint:** `/trash-schedule/{addressId}`  
**Method:** `GET`

Returns the full annual schedule for a specific address.

### Response Structure
```json
{
  "id": "3e4c1cbc-c57f-4bde-aace-aa73fa1c278b",
  "year": 2026,
  "street": "11 DYWIZJONU ARTYLERII KONNEJ",
  "buildingNumber": "14",
  "city": "BYDGOSZCZ",
  "area": "6",
  "trashSchedule": [
    {
      "month": "Styczeń",
      "schedule": [
        {
          "type": "odpady zmieszane",
          "days": ["12", "26"]
        },
        {
          "type": "papier",
          "days": ["07"]
        }
      ]
    },
    ...
  ]
}
```
- `trashSchedule` (Array): Contains monthly objects.
  - `month` (String): Polish name of the month (e.g., "Styczeń").
  - `schedule` (Array): List of waste collection events.
    - `type` (String): Type of waste (e.g., "plastik", "bio").
    - `days` (Array of Strings): The days of the month when collection occurs.
