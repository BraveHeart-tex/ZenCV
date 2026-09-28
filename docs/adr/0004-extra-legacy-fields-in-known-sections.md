# Preserve extra legacy fields in known sections

Phase 6 keeps an unrecognized extra field in a known built-in section editable through the generic field path and records a diagnostic. The compatibility mapper supports existing recognized control types; an unsupported type, a missing or duplicate required field, or an unknown section type still fails hydration. Unknown fields do not supply built-in PDF, score, or ATS values. This preserves user content without guessing semantic meaning or weakening structural validation.
