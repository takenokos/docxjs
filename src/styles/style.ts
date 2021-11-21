import { convertBoolean } from "../document/common";
import { ParagraphProperties, parseParagraphProperties } from "../document/paragraph";
import { parseRunProperties, RunProperties } from "../document/run";
import { XmlParser } from "../parser/xml-parser";
import { deserializeElement, element, fromAttribute } from "../parser/xml-serialize";

export type StyleType = 'character' | 'numbering' | 'paragraph' | 'table';

@element("style")
export class WmlStyle {
    @fromAttribute("styleId")
    id: string;
    @fromAttribute("type")
    type: StyleType;
    @fromAttribute("customStyle", convertBoolean)
    customStyle: boolean
    @fromAttribute("default", convertBoolean)
    default: boolean;

    name: string;
    basedOn: string;
    aliases: string[];
    link: string;

    next: string;
    locked: boolean;
    autoRedefine: boolean;
    hidden: boolean;
    semiHidden: boolean;
    uiPriority: number;

    paragraphProps: ParagraphProperties;
    runProps: RunProperties;
}

export function parseStyle(elem: Element, xml: XmlParser): WmlStyle {
    let result = deserializeElement(elem, new WmlStyle(), null);

    for (let e of xml.elements(elem)) {
        switch (e.localName) {
            case "pPr":
                result.paragraphProps = parseParagraphProperties(e, xml);
                break;

            case "rPr":
                result.runProps = parseRunProperties(e, xml);
                break;
    
            case "name":
                result.name = xml.attr(e, 'val');
                break;

            case "basedOn":
                result.basedOn = xml.attr(e, 'val');
                break;

            case "aliases":
                result.aliases = xml.attr(e, 'val').split(',');
                break;

            case "link":
                result.link = xml.attr(e, 'val');
                break;

            case "next":
                result.next = xml.attr(e, 'val');
                break;
        
            case "autoRedefine":
                result.autoRedefine = true;
                break;

            case "hidden":
                result.hidden = true;
                break;

            case "semiHidden":
                result.semiHidden = true;
                break;
    
            case "locked":
                result.locked = true;
                break;

            case "uiPriority":
                result.uiPriority = xml.intAttr(e, 'val');;
                break;
        }
    }

    return result;
}