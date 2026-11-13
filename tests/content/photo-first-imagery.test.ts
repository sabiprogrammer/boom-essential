import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { heroBarImages } from "@/components/home/hero-bar-images";
import { homeWork } from "@/content/home-work";
import { industrialContent } from "@/content/industrial-equipment";
import { productPhotos } from "@/content/product-photos";
import { projectGallery, projectPhotos } from "@/content/project-photos";
import { projectsContent } from "@/content/projects";
import { securityContent } from "@/content/security";
import { securitySceneImages } from "@/content/security-scene-images";

const root = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (relative: string) => readFileSync(join(root, relative), "utf8");
const code = (relative: string) => read(relative).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const publicFile = (src: string) => join(root, "public", src);

describe("photo-first imagery (client feedback, 13 Nov 2026: fewer graphs, more pictures)", () => {
  it("the schematic and chart drawings are gone and nothing imports them", () => {
    const removed = [
      "components/energy/SolarGraphic.tsx",
      "components/energy/LoadProfileDiagram.tsx",
      "components/energy/BlueprintDiagram.tsx",
      "components/security/SecurityPlanGraphic.tsx",
      "components/security/PlanDiagram.tsx",
      "components/security/SignalDiagram.tsx",
      "components/security/DomeCameraDrawing.tsx",
      "components/security/BulletCameraDrawing.tsx",
      "components/security/RecorderDrawing.tsx",
      "components/industrial/MachineStage.tsx",
      "components/industrial/MachineUnit.tsx",
    ];
    for (const file of removed) assert.ok(!existsSync(join(root, file)), `${file} should stay deleted`);
  });

  it("the Industrial Equipment hero always shows the client's photograph: no drawing fallback", () => {
    assert.equal(industrialContent.productImage.src, productPhotos.poundingMachinesSmall.src);
    assert.ok(existsSync(publicFile(industrialContent.productImage.src)));
    assert.doesNotMatch(code("components/industrial/ProductMedia.tsx"), /drawing/i);
    assert.doesNotMatch(code("components/industrial/IndustrialHero.tsx"), /MachineStage|drawing/i);
  });

  it("the homepage Industrial Equipment panel shows a photograph of the machines, not just text", () => {
    const source = code("components/home/IndustrialEquipmentSection.tsx");
    assert.match(source, /productPhotos\.poundingMachinesSmall/);
    assert.match(source, /<Image/);
  });

  it("the Energy page uses the client's own photographs instead of diagrams", () => {
    assert.match(code("components/energy/EnergyHero.tsx"), /projectPhotos\.inverterRoom/);
    const services = code("components/energy/EnergyServicesSection.tsx");
    assert.match(services, /projectPhotos\.team/);
    assert.match(services, /projectPhotos\.inverterUnits/);
  });

  it("the homepage 'Our work' band shows four authentic client photographs and links to Projects", () => {
    assert.equal(homeWork.photos.length, 4);
    const authentic = new Set(projectGallery.map((photo) => photo.src));
    for (const { photo } of homeWork.photos) {
      assert.ok(authentic.has(photo.src), `${photo.src} must be one of the client's installation photographs`);
      assert.ok(existsSync(publicFile(photo.src)), photo.src);
    }
    assert.equal(new Set(homeWork.photos.map(({ photo }) => photo.src)).size, 4, "four different photographs");
    assert.equal(homeWork.cta.href, "/projects");
    assert.equal(homeWork.lead, projectsContent.header.lead, "says no more than the Projects page does");
    assert.doesNotMatch(code("components/home/OurWorkSection.tsx"), /Illustrative|IllustrativePhoto/);
  });

  it("the hero bars: Energy is a real client photograph; Security and Foods are illustrative pictures", () => {
    assert.equal(heroBarImages.energy.src, projectPhotos.controlPanel.src);
    for (const bar of Object.values(heroBarImages)) assert.ok(bar.src && existsSync(publicFile(bar.src)), bar.src);
    assert.doesNotMatch(code("components/home/HeroBars.tsx"), /Illustrative/);
  });

  it("every Security picture that replaced a drawing is an illustrative scene, never presented as a client photograph", () => {
    const equipment = securityContent.equipment.pictures.map((item) => item.id);
    assert.deepEqual([...equipment].sort(), ["dome", "monitoring"]);
    const source = code("components/security/SecurityEquipmentSection.tsx");
    assert.match(source, /IllustrativePhoto/);
    assert.match(code("components/security/SecurityHero.tsx"), /IllustrativePhoto/);
    assert.match(code("components/security/MonitoringRows.tsx"), /securitySceneImages\.assessment/);
    for (const key of ["hero", "equipmentDome", "equipmentMonitoring", "remoteMonitoring", "assessment"] as const) {
      assert.ok(existsSync(publicFile(securitySceneImages[key].src)), key);
    }
  });

  it("the Foods page shows the staples picture in a band", () => {
    assert.match(code("app/(site)/foods/page.tsx"), /<FoodsPictureBand \/>/);
  });

  it("the new pages and sections reach the Projects page (it is linked from the nav, the footer and the homepage)", () => {
    assert.match(code("components/layout/DesktopNav.tsx"), /projectsLink/);
    assert.match(code("components/layout/MobileDrawer.tsx"), /projectsLink/);
    assert.match(code("components/layout/SiteFooter.tsx"), /projectsLink/);
    assert.match(code("content/home-work.ts"), /projectsLink/);
  });

  it("the photographs used here are the same unaltered web crops as before (no new client file was added or renamed)", () => {
    const all = [...Object.values(projectPhotos), ...Object.values(productPhotos)];
    assert.equal(all.length, 12);
    for (const photo of all) assert.ok(existsSync(publicFile(photo.src)), photo.src);
  });
});
