import { lightStandardFragment } from "./light_standard";
import { lightStandardParsFragment } from "./light_standard_pars";
import { mapStandardFragment } from "./map_standard";


export const oldStandardLightPars = `#include <lights_physical_pars_fragment>`;

export const newStandardLightPars = lightStandardParsFragment;

export const oldStandardLight = `#include <lights_physical_fragment>`;

export const newStandardLight = lightStandardFragment;

export const oldMapPars = `#include <map_pars_fragment>`;

export const newMapPars = `
    #include <map_pars_fragment>
    uniform sampler2D nightMap;
`;

export const oldStandardMap = `#include <map_fragment>`;

export const newStandardMap = mapStandardFragment;