import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function parseDOB(s: string): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s.trim());
  if (!m) return null;
  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10);
  const day = parseInt(m[3], 10);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  return { year, month, day };
}

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

export function DateOfBirthPicker({ label, value, onChange }: Props) {
  const initial = parseDOB(value);
  const [year, setYear] = useState<number | null>(initial?.year ?? null);
  const [month, setMonth] = useState<number | null>(initial?.month ?? null);
  const [day, setDay] = useState<number | null>(initial?.day ?? null);

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i),
    [currentYear],
  );
  const dayCount = year && month ? daysInMonth(year, month) : 31;
  const days = useMemo(
    () => Array.from({ length: dayCount }, (_, i) => i + 1),
    [dayCount],
  );

  useEffect(() => {
    if (year == null || month == null || day == null) return;
    const max = daysInMonth(year, month);
    if (day > max) {
      setDay(max);
      return;
    }
    const dob = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (dob !== value) onChange(dob);
  }, [year, month, day, value, onChange]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <PickerButton
          flex={2}
          title="Month"
          placeholder="Month"
          display={month ? MONTHS[month - 1] : null}
          options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))}
          selectedValue={month ? String(month) : null}
          onSelect={(v) => setMonth(Number(v))}
        />
        <PickerButton
          flex={1}
          title="Day"
          placeholder="Day"
          display={day ? String(day) : null}
          options={days.map((d) => ({ value: String(d), label: String(d) }))}
          selectedValue={day ? String(day) : null}
          onSelect={(v) => setDay(Number(v))}
        />
        <PickerButton
          flex={1.4}
          title="Year"
          placeholder="Year"
          display={year ? String(year) : null}
          options={years.map((y) => ({ value: String(y), label: String(y) }))}
          selectedValue={year ? String(year) : null}
          onSelect={(v) => setYear(Number(v))}
        />
      </View>
    </View>
  );
}

const ITEM_HEIGHT = 44;

type PickerOption = { value: string; label: string };

function PickerButton({
  flex,
  title,
  placeholder,
  display,
  options,
  selectedValue,
  onSelect,
}: {
  flex: number;
  title: string;
  placeholder: string;
  display: string | null;
  options: PickerOption[];
  selectedValue: string | null;
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const initialIndex = useMemo(() => {
    if (!selectedValue) return 0;
    const idx = options.findIndex((o) => o.value === selectedValue);
    return idx >= 0 ? idx : 0;
  }, [selectedValue, options]);

  return (
    <View style={{ flex, marginRight: 6 }}>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.picker, pressed && { opacity: 0.8 }]}
      >
        <Text
          style={[styles.pickerText, !display && styles.placeholder]}
          numberOfLines={1}
        >
          {display ?? placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{title}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              getItemLayout={(_, i) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * i, index: i })}
              initialScrollIndex={initialIndex}
              initialNumToRender={20}
              windowSize={11}
              style={styles.list}
              renderItem={({ item }) => {
                const selected = item.value === selectedValue;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item.value);
                      setOpen(false);
                    }}
                    style={({ pressed }) => [
                      styles.option,
                      selected && styles.optionSelected,
                      pressed && { backgroundColor: "rgba(245,158,11,0.15)" },
                    ]}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {item.label}
                    </Text>
                    {selected && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  row: { flexDirection: "row" },
  picker: {
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
  },
  pickerText: { flex: 1, color: "#fff", fontSize: 15 },
  placeholder: { color: "rgba(255,255,255,0.35)" },
  chevron: { color: "rgba(255,255,255,0.5)", fontSize: 12, marginLeft: 4 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#150330",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 14,
    maxHeight: "75%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginBottom: 10,
  },
  sheetTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  list: { marginTop: 6 },
  option: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  optionSelected: { backgroundColor: "rgba(245,158,11,0.18)" },
  optionText: { flex: 1, color: "rgba(255,255,255,0.85)", fontSize: 15 },
  optionTextSelected: { color: "#fde68a", fontWeight: "800" },
  check: { color: "#fde68a", fontSize: 16, fontWeight: "800" },
});
