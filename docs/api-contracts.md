# SpectraGuard Backend API Contract Mapping

This document outlines the verified API contracts connecting the Phase 6 Frontend to the Phase 4.5 Backend Inference Engine.

## 1. Authentication (P7.3)
* **Endpoint:** `/api/v1/auth/login`
* **Method:** `POST`
* **Request Schema:** `{"username": "string", "password": "password"}`
* **Response Schema:** `{"token": "string", "user": {"id": "string", "role": "string"}}`
* **Expected Errors:** * `400` Malformed request
    * `401` Invalid credentials
    * `429` Rate limit exceeded

## 2. Camera Data Integration (P7.4)
* **Endpoint:** `/api/v1/cameras`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Request Schema:** `None`
* **Response Schema (Array):** ```json
    {
      "id": "string",
      "name": "string",
      "location": "string",
      "status": "online" | "offline" | "anomalous",
      "integrityScore": "number",
      "resolution": "string",
      "fps": "number"
    }
    ```
* **Expected Errors:** `401` Unauthorized, `500` Internal Server Error

## 3. Forensics Integration (P7.5)
* **Endpoint:** `/api/v1/forensics/:id`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`
* **Request Schema:** URL Parameter `id`
* **Response Schema:**
    ```json
    {
      "id": "string",
      "cameraName": "string",
      "anomalyType": "string",
      "confidence": "number",
      "spectralEnergy": ["number[]"],
      "shapValues": [{"feature": "string", "impact": "number"}],
      "decisionSteps": ["string[]"]
    }
    ```
* **Expected Errors:** `401` Unauthorized, `404` Camera Not Found, `422` Unprocessable Entity

## 4. Prediction / Upload Integration (P7.6 & P7.7)
* **Endpoint:** `/api/v1/predict`
* **Method:** `POST`
* **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
* **Request Schema:** FormData containing `file` (Blob/File)
* **Response Schema:**
    ```json
    {
      "prediction": "string",
      "confidence": "number",
      "explanation": "string",
      "latency_ms": "number"
    }
    ```
* **Expected Errors:** `400` Invalid File Type, `401` Unauthorized, `413` Payload Too Large, `500` Inference Engine Failure

## Global Error Handling Constraints (P7.8)
All API endpoints will return a standardized error object on failure:
`{"error": "string", "code": "number", "details": "object|null"}`
