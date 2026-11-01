import { AccountMappingError, mapCharacter } from "@/infrastructure/account/mapCharacter";
import { characterPayload } from "@/test/renderWithStore";

describe("mapCharacter", () => {
  it("maps the profile fields from a character payload", () => {
    expect(mapCharacter(characterPayload)).toEqual({
      name: "Rick Sanchez",
      image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      status: "Alive",
      species: "Human",
      gender: "Male",
      origin: "Earth (C-137)",
      location: "Citadel of Ricks",
    });
  });

  it.each(["name", "image"])("rejects a character missing %s", (field: string) => {
    const input = { ...characterPayload, [field]: "" };
    expect(() => mapCharacter(input)).toThrow(AccountMappingError);
  });
});
