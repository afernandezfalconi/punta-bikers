const coastFilmMp4 = { url: "/landing/coast-film.mp4" };
const coastFilmWebm = { url: "/landing/coast-film.webm" };

// The cinematic film that plays behind the hero headline: golden-hour beach, teal scooter, 10s loop.
// WebM is offered first because it is half the weight; Safari falls through to the H.264 MP4.
// Set both values back to "" to render the bundled poster instead, without a failed request.
export const coastFilmUrl: string = coastFilmMp4.url;
export const coastFilmWebmUrl: string = coastFilmWebm.url;
