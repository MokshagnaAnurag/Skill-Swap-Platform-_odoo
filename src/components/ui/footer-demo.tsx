import Footer from "@/components/ui/animated-footer";

const FooterDemo = () => {
  return (
    <Footer
      leftLinks={[
        { href: "/terms", label: "Terms & policies" },
        { href: "/privacy-policy", label: "Privacy policy" },
      ]}
      rightLinks={[
        { href: "/about", label: "About" },
       
      ]}
      copyrightText="SkillSpark 2025. All Rights Reserved"
      barCount={23}
    />
  );
};

export default FooterDemo; 