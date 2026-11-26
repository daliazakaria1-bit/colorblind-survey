# Wayfinder: Colour Vision & Interior Comfort Study

A bilingual (English / Arabic, right-to-left) game-style version of the Google Form. It works on phones and laptops.

```
index.html      the whole site (edit the CONFIG block at the top)
Code.gs         Google Sheets backend (paste into Apps Script)
assets/plates/  the 20 Ishihara plates, extracted from your PDF (p1.jpg … p20.jpg)
assets/spaces/  flat preview of each interior (s1.jpg … s6.jpg), used for the comparison thumbnails
assets/pano/    the six 360° interiors, each cut into 6 cube faces (space1_0.jpg … space6_5.jpg), already wired up
```

## 1. Collect real responses in one Google Sheet (5 minutes, do this before sharing the link)

Until you do this the site is in **demo mode**: nothing is saved anywhere, and each participant only gets a CSV on their own device.

1. Sign in to Google and create a new Google Sheet (name it e.g. *Wayfinder responses*).
2. **Extensions → Apps Script**. Delete the sample code, paste in the whole of `Code.gs`, and click **Save**.
3. Click **Run → setup** once and approve the permissions (Google shows an "unverified app" screen because it is your own script: *Advanced → Go to project → Allow*). This creates the **Responses** and **Summary** tabs.
4. **Deploy → New deployment → ⚙ Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click Deploy and copy the **Web app URL** (it ends in `/exec`).
5. Open `index.html` in a text editor, find `SUBMIT_URL: ""` near the top and paste the URL between the quotes. Save, and publish the site again if it is already online.
6. Check it: open the web app URL in a browser. You should see `{"ok":true,"message":"Wayfinder survey backend is running.","responses_so_far":0}`.
7. Do one full test run of the site yourself. A row should appear in **Responses** within a few seconds. Then delete that test row (the Summary counts update by themselves).

**What you see, like Google Forms**
- **Responses** tab: one row per participant. Column A is the respondent number (1, 2, 3 …), column B the date and time received, then every answer (profile, vision answers, `plate_1` … `plate_20`, the 90 ratings `s1_orderly` … `s6_accessible`, the six comparison picks, the open answer, consent name, interview answer and optional email, time per space, screening result).
- **Summary** tab: total responses, the time of the last one, and how many agreed to an email interview.
- New rows appear on their own while the sheet is open. **File → Download → CSV** gives you the data for SPSS / Excel.

**Good to know**
- A response is only saved when the participant reaches the very last button. If someone stops halfway, nothing is recorded (same as a Google Form that was never submitted).
- If a participant has no signal at the end, their answers stay on their phone and are sent automatically the next time they open the site with a connection. The sheet ignores repeats, so there are no duplicates.
- If you change `Code.gs` later, use **Deploy → Manage deployments → ✏ Edit → New version**, otherwise the old code keeps running.
- The sheet holds names and optional emails: keep it private and share it only with your supervisor.
- Anyone who knows the web app URL could post to it, so don't publish that URL anywhere; it is only inside the site's code.
- **Starting over after testing?** Delete the test rows, or use a fresh sheet. The columns changed in this version of the site, so don't reuse a sheet from the old version (or delete its header row first).

## 2. The 360° interiors

The six interiors are already installed and work offline: the viewer is built into `index.html` (no internet or extra library needed, and it also works when you open the file directly). Visitors drag or swipe to look around, pinch / scroll / +− buttons to zoom, arrow keys to turn, and there is a fullscreen button.

To swap an image, cut your equirectangular panorama (2:1 JPG/PNG) into six cube faces named `spaceN_0.jpg … spaceN_5.jpg` (front, right, back, left, up, down) in `assets/pano/`, or ask for the helper script.

## 3. Publish it

The site is a static folder, so any static host works and it is free:

- **Netlify Drop**: go to app.netlify.com/drop and drag the whole folder in. You get a link in seconds.
- **GitHub Pages**: upload the folder to a repository and enable Pages.

Opening `index.html` by double-click works for testing, but the 360° viewer needs a web server (use one of the hosts above, or run `python3 -m http.server` in the folder).

## 4. Check before you launch

**Answer key for the colour plates.** The Google Form PDF does not show which answers are correct, so the key in `PLATES` (`ans:`) is my best guess from the standard Ishihara set. Compare it with the answer key in your Form (Questions → Answer key) and correct any plate that differs. The sheet stores both the raw answer and the key, so you can re-score afterwards without losing anything.
Plates 15, 16, 17, 19 and 20 are recorded but not used in the screening result, because their intended answers are ambiguous from the PDF.

**Screening result.** `typical` means 0 mismatches on the scored plates, `borderline` 1–2, `possible_cvd` 3 or more. This is a simple screening rule for research, not a clinical diagnosis. Both plate sets are red–green plates, so the site cannot detect blue–yellow deficiency. Self-reported type is saved separately in `cvd_type_reported`.

**Plate fairness.** Points are given for answering, never for being "right", and the game shows no right/wrong colours, so people with colour blindness are not made to feel they failed.

**Arabic text.** I translated the questionnaire items myself. For a thesis, have the Arabic wording checked (ideally back-translated) by the supervisor or a language specialist.

**Ethics.** The site collects a consent name and an optional email (for the interview). Check with the supervisor that the university's ethics approval covers the changed format.

**Results shown to participants.** The consent form says "I would not like my own results reported back to me", but the site shows a colour-vision snapshot after the plates and on the last screen. If you want the site to follow the consent literally, remove the `plateResult` screen and the snapshot box on the last screen (ask and I will do it).

## Questions: how they match the Google Form (updated 25 Nov version)

The question wording and options follow the updated Form:

- **Profile:** Age (the four ranges *from 17 to 20 / 20 to 23 / 23 to 25 / 25 to 30*), University name (optional), Faculty, Gender.
- **Vision:** other eye condition, diagnosed CVD (Yes / No / I am not sure / I have never been tested), type of CVD (now asked of everyone, with *I am a normal-sighted person*), and the 1–5 daily-impact question (also asked of everyone, as in the Form).
- **Plates:** the same 20 plates and options. Plates 1, 5, 6, 7, 15, 16 and 17 say "I see nothing"; the others say "I see nothing / something else", exactly as in the Form.
- **Each space: 15 pairs in 3 sections**, in the Form's order and wording: *Section 1 Spatial Organization & Wayfinding* (Cluttered–Orderly, navigate, locate destinations, functional zones, layout), *Section 2 Interior Design & Visual Comfort* (visually comfortable, colour contrast, distinguish objects, harsh–gentle, clashing–harmonious), *Section 3 Medical & UX Integration* (mentally demanding–undemanding, stressful–relaxing, unsafe–safe, exclusionary–inclusive, inaccessible–accessible). The scale instructions are the Form's.
- **Comparison:** the six questions use the Form's wording, followed by the "change one thing" question.
- **Closing screen:** the research consent form (English and Arabic) with the MSA University and Faculty of Engineering logos at the top (`assets/logo-msa.png`, `assets/logo-faculty.png`), then *write your name* (required), *Could I have an interview with you through email?* (Yes / No, required) and *Email* (optional), as at the end of the Form.

Still different from the Form, on purpose:

- The six interiors are shown as 360° spaces (called "Space 1–6") instead of photo collages.
- The hand-written name file upload is not included.
- The avatar, XP and guide character are part of the game layer and are not in the Form.
- Removed from the earlier site version because the Form does not ask them: Email and Full name on the profile, Occupation, Country, and the numeric age. Faculty is now required for everyone.
- The Arabic wording of the new rating pairs and of the changed questions is my translation. The Arabic consent text is copied from the Form's Arabic consent page.

Saved progress from the previous version of the site is not reused (the storage key was changed to `wayfinder_cvd_v2`).

## Look and feel (sunset gallery)

A deep plum (`#3B1D5A`) sky that warms into orange and gold toward the bottom of the screen, with frosted plum-glass cards, gold-to-coral buttons, and serif headings (Playfair Display for English, Cairo for Arabic). All colours are variables at the top of the `<style>` block (`--bg0` to `--bg3`, `--accent`, `--rose`, `--coral`, `--gold`, `--sun`).

- **Split screen on each space.** On a laptop the photos or 360° view stay on the left (sticky) while the guide and the rating cards sit on the right. On phones they stack. In Arabic the layout mirrors. The 360° viewer is not reloaded between the 16 questions.
- **Guide character.** "Wayo", a small map-pin mascot, gives speech-bubble tips and cheers at milestones. In `CONFIG`, set `GUIDE: "avatar"` to use the participant's own avatar instead. Tip texts are the `g_*` entries in `STR`.
- **Colour plates stay on a neutral light card** on purpose, so the theme does not bias the colour-vision test.
