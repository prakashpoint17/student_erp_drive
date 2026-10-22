# Student ERP System (100% Serverless & Python-Free)

A modern, responsive Student ERP System built on **React (Vite)**, **Firebase Authentication & Firestore Metadata**, and **Decentralized Google Drive & Sheets (15 GB Free Tier per Gmail account)**.

## 🎨 Theme & UI Design
- **Theme Background**: Clean, crisp white & subtle slate canvas (`#FFFFFF` / `#F8FAFC`).
- **Brand Colors**: 
  - **Royal Blue**: Primary institutional actions, navigation, student badges (`#1D4ED8`, `#2563EB`).
  - **Crimson Red**: Super Admin badges, emergency circulars, critical actions (`#DC2626`, `#B91C1C`).
- **Responsive**: Fully responsive across mobile, tablet, and widescreen desktop layouts.

---

## 🏛️ Multi-Tier Hierarchy & Role Matrix

1. **Super Admin (Level 1)**:
   - Full institutional governance.
   - Create and manage academic departments.
   - Appoint and change Head of Departments (HODs).
   - View institutional stats, Drive spaces registry, and immutable security audit logs.

2. **HOD / Department Head (Level 2)**:
   - Complete authority over department faculty and staff.
   - Add new faculty and edit staff records.
   - Appoint staff as **Class Tutors / Section Incharges**.
   - Connect the **Department Common Space** (`rvscse.dept@gmail.com`) and individual **Batch Spaces** (`rvscse2026@gmail.com`).

3. **Staff / Faculty & Class Tutor (Level 3)**:
   - Maintain and update personal faculty profile.
   - If appointed as **Class Tutor**:
     - Exclusive authorized write/edit access over students in their assigned batch and section.
     - Add new student records directly into the Google Sheet.
     - Publish class tasks and Google Form announcements.
     - Review and approve/reject student profile correction requests.

4. **Student (Level 4)**:
   - View personal profile, attendance percentage, and cumulative CGPA.
   - View assigned class tutor information.
   - Access class tasks and submit Google Form responses.
   - Submit formal **Profile Correction Requests** to the class tutor for details like phone number or address changes.

---

## ☁️ Zero-Cost Google Drive Gateway (`google-apps-script/Code.js`)

To keep hosting costs at **₹0** without running a Python or FastAPI server:
1. Open Google Drive in the space account (e.g. `rvscse2026@gmail.com`).
2. Create a Google Sheet named `ERP_Master_Database`.
3. Click **Extensions > Apps Script** and paste `google-apps-script/Code.js`.
4. Click **Deploy > New Deployment > Web App** (Set *Execute as: Me*, *Access: Anyone*).
5. Copy the generated Web App URL and paste it into the ERP's **Connect Space** dialog.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.
