import React, { useRef, useEffect, createRef } from "react";
import ReactDOM from "react-dom";
import "./styles.scss";

const Frame = ({ text }) => <div>{text}</div>;

export default function App() {
  const text = [
    "hi fsdfsfsdfssdfdsfdf ",
    "there",
    "you ",
    "fdsdfsdsfds",
    "lorem",
    "lorem",
    "lorem",
    "lorem",
    "lorem",
    "lorem",
    "lorem"
  ];

  const items = text.map((t) => <Frame text={t} />);

  const refs = useRef(items.map(() => createRef()));

  useEffect(() => {
    window.addEventListener("scroll", moveCamera);
    window.addEventListener("mousemove", moveCameraAngle);
    setSceneHeight();

    return () => {
      window.removeEventListener("scroll", moveCamera);
      window.removeEventListener("mousemove", moveCameraAngle);
    };
  });

  // function isInViewport(el, offset = 0) {
  //   if (!el) return false;
  //   const top = el.getBoundingClientRect().top;

  //   console.log(top, window.innerHeight);

  //   return top + offset >= 0 && top - offset <= window.innerHeight;
  // }

  function setSceneHeight() {
    const numberOfItems = items.length; // Or number of items you have in `.scene3D`
    const itemZ = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--itemZ")
    );
    const scenePerspective = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--scenePerspective"
      )
    );
    const cameraSpeed = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--cameraSpeed"
      )
    );

    const height =
      window.innerHeight +
      scenePerspective * cameraSpeed +
      itemZ * cameraSpeed * numberOfItems;

    // Update --viewportHeight value
    document.documentElement.style.setProperty("--viewportHeight", height);
  }

  function moveCamera() {
    document.documentElement.style.setProperty("--cameraZ", window.pageYOffset);
  }

  const perspectiveOrigin = {
    x: parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--scenePerspectiveOriginX"
      )
    ),
    y: parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--scenePerspectiveOriginY"
      )
    ),
    maxGap: 10
  };

  function moveCameraAngle(event) {
    const xGap =
      (((event.clientX - window.innerWidth / 2) * 100) /
        (window.innerWidth / 2)) *
      -1;
    const yGap =
      (((event.clientY - window.innerHeight / 2) * 100) /
        (window.innerHeight / 2)) *
      -1;
    const newPerspectiveOriginX =
      perspectiveOrigin.x + (xGap * perspectiveOrigin.maxGap) / 100;
    const newPerspectiveOriginY =
      perspectiveOrigin.y + (yGap * perspectiveOrigin.maxGap) / 100;

    document.documentElement.style.setProperty(
      "--scenePerspectiveOriginX",
      newPerspectiveOriginX
    );
    document.documentElement.style.setProperty(
      "--scenePerspectiveOriginY",
      newPerspectiveOriginY
    );
  }

  const handleItemClick = (i) => () =>
    refs.current[i].current.classList.toggle(`rotated-${i + 1}`);

  return (
    <div className="viewport">
      <div className="scene3D-container">
        <div className="scene3D">
          {items.map((el, index) => (
            <div
              ref={refs.current[index]}
              className={`item ${index % 2 ? "odd" : "even"}`}
              onClick={handleItemClick(index)}
              key={index}
            >
              {el}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
