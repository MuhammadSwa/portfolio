# How to Add New Cases

This guide explains how to add new dental cases to your portfolio.

## Quick Start

1. Create a new folder in `src/content/cases/` with a descriptive name (e.g., `class-ii-molar-restoration-2024-01/`)
2. Add your images directly into this folder
3. Create an `index.md` or `index.mdx` file with your case details
4. Reference images using relative paths like `./before.jpg`

**Note:** Images placed alongside your markdown files in `src/content/cases/` are automatically optimized by Astro, unlike images in `public/` which are served as-is.

## Folder Structure

```
src/content/cases/
  your-case-name/
    index.mdx          # or index.md for simple cases
    before.jpg         # Your case images
    after.jpg
    xray.jpg
    during-1.jpg
```

## Case Template (index.md)

```markdown
---
title: "Your Case Title"
category: "restorations"  # Options: restorations, endodontics, fixed-prosthodontics, extractions, periodontics, other
date: 2024-12-23
patientAge: 35
patientGender: "male"  # Options: male, female
toothNumber: "16"
chiefComplaint: "Patient's main complaint"
diagnosis: "Your diagnosis"
treatment: "Treatment performed"
materials:
  - "Material 1"
  - "Material 2"
  - "Material 3"
difficulties:
  - "Challenge 1 you faced"
  - "Challenge 2 you faced"
learnings: "Key takeaways from this case"
outcome: "excellent"  # Options: excellent, good, satisfactory, needs-follow-up
followUp: "Follow-up plan"
images:
  - src: "./before.jpg"      # Relative path to image in same folder
    alt: "Description of the image"
    stage: "before"  # Options: before, during, after, xray, other
  - src: "./after.jpg"
    alt: "Description of the image"
    stage: "after"
featured: false  # Set to true for featured cases
tags:
  - "tag1"
  - "tag2"
---

## Case Summary

Write a detailed summary of the case here. You can use full Markdown formatting.

## Clinical Notes

Add clinical observations, findings, etc.

## Technique Details

1. **Step 1**: Description
2. **Step 2**: Description
3. **Step 3**: Description

## Outcome

Describe the outcome and patient satisfaction.
```

## MDX Template (index.mdx) - For Embedding Images in Content

If you want to embed optimized images directly in your case content, use MDX:

```mdx
---
title: "Your Case Title"
category: "restorations"
date: 2024-12-23
treatment: "Treatment performed"
images:
  - src: "./before.jpg"
    alt: "Before treatment"
    stage: "before"
  - src: "./after.jpg"
    alt: "After treatment"
    stage: "after"
featured: true
tags:
  - "composite"
---

import { Image } from 'astro:assets';
import beforeImg from './before.jpg';
import afterImg from './after.jpg';

## Case Summary

Your case description here.

## Clinical Photos

<div class="grid md:grid-cols-2 gap-4 my-8">
  <figure>
    <Image src={beforeImg} alt="Before treatment" class="rounded-lg" />
    <figcaption class="text-center text-slate-400 mt-2">Before Treatment</figcaption>
  </figure>
  <figure>
    <Image src={afterImg} alt="After treatment" class="rounded-lg" />
    <figcaption class="text-center text-slate-400 mt-2">After Treatment</figcaption>
  </figure>
</div>

## Outcome

Describe the results here.
```

## Image Organization

### Recommended Naming Convention

Use descriptive names for your images:
- `before.jpg` / `before-1.jpg`
- `during.jpg` / `during-prep.jpg`
- `after.jpg` / `after-final.jpg`
- `xray-pre.jpg` / `xray-post.jpg`

### Image Stages

- `before` - Pre-operative images
- `during` - Intra-operative images
- `after` - Post-operative images
- `xray` - Radiographic images
- `other` - Any other documentation

## Categories

| Category | ID | Use For |
|----------|-----|---------|
| Restorations | `restorations` | Composites, amalgams, glass ionomers |
| Endodontics | `endodontics` | Root canal treatments, pulpotomies |
| Fixed Prosthodontics | `fixed-prosthodontics` | Crowns, bridges, veneers |
| Extractions | `extractions` | Simple and surgical extractions |
| Periodontics | `periodontics` | Scaling, root planing, surgeries |
| Other | `other` | Any other procedures |

## Outcome Levels

- `excellent` - Ideal result, textbook outcome
- `good` - Very good result with minor deviations
- `satisfactory` - Acceptable result, functional
- `needs-follow-up` - Requires monitoring or additional treatment

## Tips

1. **Be Consistent**: Use similar formatting across all cases
2. **Document Challenges**: The difficulties section is valuable for learning
3. **Include Learnings**: What would you do differently?
4. **Good Photos**: Take clear, well-lit clinical photos
5. **Patient Privacy**: Never include identifiable patient information
6. **Regular Updates**: Add follow-up notes when available
7. **Image Optimization**: Images in `src/content/cases/` are automatically optimized by Astro

## Migrating Existing Images

If you have images in `public/pics/` or `public/cases/`, move them to your case folders:

```bash
# Create case folder
mkdir -p src/content/cases/my-case-name

# Copy images to case folder
cp public/pics/my-image.jpg src/content/cases/my-case-name/

# Create index.md or index.mdx with relative image paths
```

Images in `src/content/cases/` are **optimized** (converted to WebP, resized, etc.), while images in `public/` are served as-is without optimization.
