import { PropsWithChildren, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius } from "../theme";

export function Screen({ children, scrollable = true }: PropsWithChildren<{ scrollable?: boolean }>) {
  if (scrollable) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.screen, styles.screenContent]}>{children}</View>;
}

export function Card({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

export function Title({ children }: PropsWithChildren) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Eyebrow({ children }: PropsWithChildren) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Body({ children }: PropsWithChildren) {
  return <Text style={styles.body}>{children}</Text>;
}

export function Field(props: React.ComponentProps<typeof TextInput>) {
  return <TextInput placeholderTextColor={colors.muted} style={styles.field} {...props} />;
}

export function Textarea(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      style={[styles.field, styles.textarea]}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      {...props}
    />
  );
}

export function Select({
  label,
  value,
  options,
  onValueChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label || label;

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={styles.field}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ color: value ? colors.ink : colors.muted }}>{selectedLabel}</Text>
        </View>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable onPress={() => setVisible(false)} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Title>{label}</Title>
            <ScrollView style={{ marginTop: 16 }}>
              {options.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => {
                    onValueChange(opt.value);
                    setVisible(false);
                  }}
                  style={styles.option}
                >
                  <Text style={[styles.optionText, opt.value === value && { color: colors.teal, fontWeight: "700" }]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export function PrimaryButton({ label, onPress, loading }: { label: string; onPress?: () => void; loading?: boolean }) {
  return (
    <Pressable onPress={loading ? undefined : onPress} style={[styles.primaryButton, loading && { opacity: 0.7 }]}>
      <Text style={styles.primaryButtonText}>{loading ? "Cargando..." : label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, disabled }: { label: string; onPress?: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={disabled ? undefined : onPress} style={[styles.secondaryButton, disabled && { opacity: 0.6 }]}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef6f6",
  },
  screenContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
  },
  eyebrow: {
    color: colors.teal,
    textTransform: "uppercase",
    letterSpacing: 3,
    fontSize: 11,
    fontWeight: "700",
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: "800",
  },
  body: {
    color: colors.slate,
    fontSize: 15,
    lineHeight: 22,
  },
  field: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xl,
    height: 52,
    paddingHorizontal: 16,
    color: colors.ink,
    justifyContent: "center",
  },
  textarea: {
    height: 120,
    paddingVertical: 12,
  },
  primaryButton: {
    backgroundColor: colors.teal,
    borderRadius: radius.xl,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.ink,
    fontWeight: "700",
    fontSize: 16,
  },
  pill: {
    alignSelf: "flex-start",
    backgroundColor: colors.tealSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: 24,
    maxHeight: "80%",
  },
  option: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  optionText: {
    fontSize: 18,
    color: colors.ink,
  },
});
