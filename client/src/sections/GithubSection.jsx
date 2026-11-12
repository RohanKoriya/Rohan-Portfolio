// import { Component, cloneElement, useEffect, useRef, useState } from "react";
// import { GitHubCalendar } from "react-github-calendar";

// const USERNAME = "rohankoriya";

// /* GitHub's original contribution palette (5 levels, light + dark) */
// const GITHUB_THEME = {
//   light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
//   dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
// };

// const WEEKS = 53;
// const BLOCK_MARGIN = 4;
// const LABEL_GUTTER = 40; // space taken by the weekday labels

// /* Follows the portfolio's class-based dark mode */
// function useIsDark() {
//   const get = () =>
//     typeof document !== "undefined" &&
//     document.documentElement.classList.contains("dark");
//   const [isDark, setIsDark] = useState(get);

//   useEffect(() => {
//     const observer = new MutationObserver(() => setIsDark(get()));
//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     return () => observer.disconnect();
//   }, []);

//   return isDark;
// }

// /* Sizes the cells so the graph fills the container width (scrolls on small screens) */
// function useFitBlockSize(ref) {
//   const [size, setSize] = useState(12);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const update = () => {
//       const fit =
//         Math.floor((el.clientWidth - LABEL_GUTTER) / WEEKS) - BLOCK_MARGIN;
//       setSize(Math.max(9, Math.min(fit, 20)));
//     };
//     update();
//     const observer = new ResizeObserver(update);
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [ref]);

//   return size;
// }

// class CalendarBoundary extends Component {
//   state = { failed: false };

//   static getDerivedStateFromError() {
//     return { failed: true };
//   }

//   render() {
//     if (this.state.failed) {
//       return (
//         <p className="text-sm text-muted dark:text-muted-dark">
//           Couldn&rsquo;t load contributions.{" "}
//           <button
//             type="button"
//             onClick={() => this.setState({ failed: false })}
//             className="underline text-ink underline-offset-4 dark:text-ink-dark"
//           >
//             Try again
//           </button>
//         </p>
//       );
//     }
//     return this.props.children;
//   }
// }

// export default function GithubSection() {
//   const isDark = useIsDark();
//   const wrapRef = useRef(null);
//   const scrollerRef = useRef(null);
//   const touchedRef = useRef(false);
//   const blockSize = useFitBlockSize(wrapRef);

//   /* On narrow screens, keep the most recent weeks in view */
//   useEffect(() => {
//     const scroller = scrollerRef.current;
//     if (!scroller || !scroller.firstElementChild) return;
//     const toEnd = () => {
//       if (!touchedRef.current) scroller.scrollLeft = scroller.scrollWidth;
//     };
//     const observer = new ResizeObserver(toEnd);
//     observer.observe(scroller.firstElementChild);
//     toEnd();
//     return () => observer.disconnect();
//   }, [blockSize]);

//   return (
//     <section
//       id="github"
//       className="pt-12 pb-20 border-t border-dashed border-line dark:border-line-dark sm:pt-14 md:pt-16 md:pb-24"
//     >
//       <div ref={wrapRef} className="w-full px-5 mx-auto max-w-content sm:px-8">
//         <h2 className="mb-10 text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark sm:text-3xl">
//           GitHub activity
//         </h2>

//         <CalendarBoundary>
//           <div
//             ref={scrollerRef}
//             onScroll={() => (touchedRef.current = true)}
//             onTouchStart={() => (touchedRef.current = true)}
//             className="overflow-x-auto pb-1 text-muted [scrollbar-width:none] dark:text-muted-dark [&::-webkit-scrollbar]:hidden"
//           >
//             <div
//               className={[
//                 "w-max min-w-full",
//                 "[&_.react-activity-calendar__footer]:mt-5",
//                 "[&_.react-activity-calendar__count]:text-ink",
//                 "dark:[&_.react-activity-calendar__count]:text-ink-dark",
//               ].join(" ")}
//             >
//               <GitHubCalendar
//                 username={USERNAME}
//                 colorScheme={isDark ? "dark" : "light"}
//                 theme={GITHUB_THEME}
//                 blockSize={blockSize}
//                 blockMargin={BLOCK_MARGIN}
//                 blockRadius={3}
//                 fontSize={13}
//                 showWeekdayLabels
//                 showMonthLabels
//                 showColorLegend
//                 showTotalCount
//                 labels={{
//                   totalCount: "{{count}} contributions in the last year",
//                   legend: { less: "Less", more: "More" },
//                 }}
//                 style={{ color: "inherit" }}
//                 errorMessage="Unable to load contributions."
//                 renderBlock={(block, activity) =>
//                   cloneElement(block, {
//                     children: (
//                       <title>
//                         {`${activity.count} ${
//                           activity.count === 1
//                             ? "contribution"
//                             : "contributions"
//                         } on ${new Date(activity.date).toLocaleDateString(
//                           "en-US",
//                           {
//                             month: "short",
//                             day: "numeric",
//                             year: "numeric",
//                             timeZone: "UTC",
//                           },
//                         )}`}
//                       </title>
//                     ),
//                   })
//                 }
//               />
//             </div>
//           </div>
//         </CalendarBoundary>
//       </div>
//     </section>
//   );
// }

import { Component, cloneElement, useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

const USERNAME = "rohankoriya";

/* Switch between "mono" (gray / white, like the reference) and "green" (GitHub original) */
const PALETTE = "mono";

const PALETTES = {
  green: {
    light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  },
  mono: {
    light: ["#ebebed", "#d1d1d5", "#b0b0b6", "#85858c", "#5a5a61"],
    dark: ["#18181b", "#34343a", "#5c5c64", "#9a9aa3", "#f4f4f6"],
  },
};

const GITHUB_THEME = PALETTES[PALETTE];

const WEEKS = 54; // a year can span up to 54 week columns
const BLOCK_MARGIN = 4;
const LABEL_GUTTER = 64; // weekday labels + breathing room so nothing clips

/* Follows the portfolio's class-based dark mode */
function useIsDark() {
  const get = () =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const [isDark, setIsDark] = useState(get);

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(get()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

/* Sizes the cells so the graph fills the container width (scrolls on small screens) */
function useFitBlockSize(ref) {
  const [size, setSize] = useState(12);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const style = getComputedStyle(el);
      const inner =
        el.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      const fit = Math.floor((inner - LABEL_GUTTER) / WEEKS) - BLOCK_MARGIN;
      setSize(Math.max(9, Math.min(fit, 20)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

class CalendarBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="text-sm text-muted dark:text-muted-dark">
          Couldn&rsquo;t load contributions.{" "}
          <button
            type="button"
            onClick={() => this.setState({ failed: false })}
            className="underline text-ink underline-offset-4 dark:text-ink-dark"
          >
            Try again
          </button>
        </p>
      );
    }
    return this.props.children;
  }
}

export default function GithubSection() {
  const isDark = useIsDark();
  const wrapRef = useRef(null);
  const scrollerRef = useRef(null);
  const touchedRef = useRef(false);
  const blockSize = useFitBlockSize(wrapRef);

  /* On narrow screens, keep the most recent weeks in view */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !scroller.firstElementChild) return;
    const toEnd = () => {
      if (!touchedRef.current) scroller.scrollLeft = scroller.scrollWidth;
    };
    const observer = new ResizeObserver(toEnd);
    observer.observe(scroller.firstElementChild);
    toEnd();
    return () => observer.disconnect();
  }, [blockSize]);

  return (
    <section
      id="github"
      className="py-20 border-t border-line dark:border-line-dark md:py-28"
    >
      <div ref={wrapRef} className="w-full px-5 mx-auto max-w-content sm:px-8">
        <h2 className="mb-10 text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark sm:text-3xl">
          GitHub activity
        </h2>

        <CalendarBoundary>
          <div
            ref={scrollerRef}
            onScroll={() => (touchedRef.current = true)}
            onTouchStart={() => (touchedRef.current = true)}
            className="overflow-x-auto pb-1 text-muted [scrollbar-width:none] dark:text-muted-dark [&::-webkit-scrollbar]:hidden"
          >
            <div
              className={[
                "w-max min-w-full",
                "[&_.react-activity-calendar__footer]:mt-5",
                "[&_.react-activity-calendar__count]:text-ink",
                "dark:[&_.react-activity-calendar__count]:text-ink-dark",
              ].join(" ")}
            >
              <GitHubCalendar
                username={USERNAME}
                colorScheme={isDark ? "dark" : "light"}
                theme={GITHUB_THEME}
                blockSize={blockSize}
                blockMargin={BLOCK_MARGIN}
                blockRadius={3}
                fontSize={13}
                showWeekdayLabels
                showMonthLabels
                showColorLegend
                showTotalCount
                labels={{
                  totalCount: "{{count}} contributions in the last year",
                  legend: { less: "Less", more: "More" },
                }}
                style={{ color: "inherit" }}
                errorMessage="Unable to load contributions."
                renderBlock={(block, activity) =>
                  cloneElement(block, {
                    children: (
                      <title>
                        {`${activity.count} ${
                          activity.count === 1
                            ? "contribution"
                            : "contributions"
                        } on ${new Date(activity.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            timeZone: "UTC",
                          },
                        )}`}
                      </title>
                    ),
                  })
                }
              />
            </div>
          </div>
        </CalendarBoundary>
      </div>
    </section>
  );
}
