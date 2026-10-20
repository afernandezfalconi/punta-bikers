<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the independent Punta Biker preview as a single index route with browser-only inquiry state; this separates the design preview from the existing application and avoids a booking backend.
- Define visual roles and responsive editorial layout in src/styles.css; this keeps the page and controls consistent across screen sizes.
- Keep inquiry message generation in src/lib/inquiry.ts with concrete boundary tests; this ensures copy and WhatsApp share use the same non-booking message.
- Configure the optional cinematic MP4 in src/lib/media.ts and retain the bundled poster on load failure or reduced motion; this allows a later film swap without changing the page structure.
