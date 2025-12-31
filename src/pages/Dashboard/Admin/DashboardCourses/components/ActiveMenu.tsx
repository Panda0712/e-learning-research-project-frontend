import type { ReactNode } from "react";
import React, { useEffect, useRef } from "react";

interface ActionMenuProps {
  onClose: () => void;
  children: ReactNode;
  positionClass?: string;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  onClose,
  children,
  positionClass = "right-8 top-0",
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={`absolute ${positionClass} z-50 w-36 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] py-2 border border-gray-100 animate-in fade-in zoom-in-95 duration-100 origin-top-right overflow-hidden`}
    >
      {children}
    </div>
  );
};

export default ActionMenu;
