export function map_name(name: string): string {

    switch (name) {

        case "run_command":
            return "Ran Command";
        case "search_web":
            return "Researched";
        default:
            return name;

    }
}
