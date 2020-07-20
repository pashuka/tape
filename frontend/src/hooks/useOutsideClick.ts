import { useState, RefObject, createRef, useEffect, Dispatch, SetStateAction } from "react";

type useOutsideClickType<T extends HTMLElement> = [
  RefObject<T>,
  boolean,
  Dispatch<SetStateAction<boolean>>
];

type initialType = boolean;

export default function useOutsideClick<T extends HTMLElement>(
  initial: initialType
): useOutsideClickType<T> {
  const [isVisible, setIsVisible] = useState<initialType>(initial);
  const ref = createRef<T>();

  const handleHideDropdown = (e: KeyboardEvent) => {
    // User pressed the escape, close suggestions
    if (e.keyCode === 27) {
      setIsVisible(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return [ref, isVisible, setIsVisible];
}
