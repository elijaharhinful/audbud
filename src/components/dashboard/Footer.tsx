import React from "react";
import { FooterProps } from "@/lib/types";

export default function Footer({ isDark }: FooterProps) {
  return (
    <footer
      className={`${
        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } border-b px-6 py-4`}
    >
      <div className="flex items-center justify-center">
        <div>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            © 2025 Audbud. All rights reserved!
          </p>
        </div>
      </div>
    </footer>
  );
}
