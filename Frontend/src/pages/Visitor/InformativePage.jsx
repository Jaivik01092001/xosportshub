import React from "react";
import "../../styles/InformativePage.css";

const InformativePage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        About the Sports Marketplace
      </h2>
      <p className="mb-4 text-muted">
        Our platform connects athletes with expert coaches and sports content
        sellers from around the world. Whether you're a beginner or a pro,
        you’ll find training content tailored to your sport and goals.
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Buy and preview digital content (videos, PDFs, etc.)</li>
        <li>Connect with verified coaches and sellers</li>
        <li>Request custom training content</li>
        <li>Participate in content auctions</li>
        <li>Secure payments and admin-verified sellers</li>
      </ul>
    </div>
  );
};

export default InformativePage;
