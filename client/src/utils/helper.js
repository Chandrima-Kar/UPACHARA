export default function convertStringList(stringList) {
  if (!Array.isArray(stringList) || stringList.length === 0) {
    return [];
  }

  try {
    let cleanedString = stringList[0];

    let result = cleanedString.replace(/^\[\'|\'\]$/g, "").split("', '");

    return result;
  } catch (error) {
    console.error("Error converting string list:", error);
    return [];
  }
}
