import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

const preloadFonts = (id) => {
  return new Promise((resolve) => {
    WebFont.load({
      typekit: {
        id: id,
      },
      active: resolve,
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  // Registrar plugins GSAP siempre tan pronto como sea posible
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

  // Usar la API Font Loading para asegurar que la fuente está cargada
  await preloadFonts("lnu1fpi");

  // Quitar la clase loading y mostrar la página
  document.documentElement.classList.remove("loading");
  document.documentElement.classList.add("js");

  initAnimations();
});

function initAnimations() {
  // Animar texto palabra a palabra con apariciones y desapariciones al hacer scroll hacia arriba
  document.querySelectorAll("[data-effect-2]").forEach((elem) => {
    // Dividir texto en palabras
    const split = new SplitText(elem, { type: "words" });
    const words = split.words;

    // Crear línea de tiempo con scroll controlado (scrub)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: elem,
        start: "top 90%", // cuando el top del elem llegue al 90% del viewport
        end: "bottom 80%", // hasta que el bottom del elem llegue al 60% del viewport
        scrub: true, // animación ligada al scroll
      },
    });

    // Animar cada palabra desde opacity 0 y y=20 a opacity 1 y y=0 con stagger individual
    tl.fromTo(
      words,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, ease: "power1.out" }
    );

    // Para que al hacer scroll reverse desaparezcan palabra por palabra automáticamente, no se necesita toggleActions
    // porque scrub garantiza el control total del progreso con el scroll
  });

  document.querySelectorAll("img[data-effect-2]").forEach((img) => {
    gsap.fromTo(
      img,
      { opacity: 0, y: 20, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        duration: 1,
        ease: "power2.out",
      }
    );
  });
}
