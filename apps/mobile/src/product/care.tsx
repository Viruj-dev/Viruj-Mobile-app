import { SearchInput, Stars } from "./web-controls";
export { SearchInput, Stars } from "./web-controls";
// Native port of web doctors, hospitals, department-page and department doctors pages.
import { useEffect, useState } from "react";
import { Image, Linking, Pressable, Text, TextInput, View } from "react-native";
import { type CareItem, webOrigin } from "./api";
import { type Navigate } from "./home";
import {
  Body,
  Button,
  Card,
  colors,
  Empty,
  ErrorText,
  Glyph,
  Heading,
  ResourceState,
  Row,
  Screen,
  s,
  useResource,
  Field,
} from "./ui";
import { PathlabDetail, Pathlabs } from "./pathlabs";
export function Photo({
  item,
  kind,
  size = 80,
  round = false,
}: {
  item: CareItem;
  kind: string;
  size?: number;
  round?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const uri = item.imageUrl || item.image_url;
  return (
    <View
      style={{
        width: kind === "hospitals" && !round ? 112 : size,
        height: size,
        borderRadius: round ? size / 2 : 12,
        backgroundColor: round
          ? kind === "doctors"
            ? "#DBEAFE"
            : "#FEE2E2"
          : "#F9FAFB",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {uri && !failed ? (
        <Image
          accessibilityLabel={item.name}
          source={{ uri: uri.startsWith("/") ? `${webOrigin}${uri}` : uri }}
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <Glyph
          name={kind === "doctors" ? "person-outline" : "business-outline"}
          color={kind === "doctors" ? "#60A5FA" : "#F87171"}
          size={size / 2}
        />
      )}
    </View>
  );
}
export function ProviderCard({
  item,
  kind,
  navigate,
  variant = "directory",
}: {
  item: CareItem;
  kind: string;
  navigate: Navigate;
  variant?: "directory" | "department" | "nearby";
}) {
  const doctor = kind === "doctors";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${item.name}`}
      onPress={() => navigate({ name: "detail", kind, id: String(item.id) })}
    >
      <Card
        style={{
          padding: 16,
          borderRadius: variant === "directory" ? 16 : 8,
          borderColor: variant === "directory" ? "#F3F4F6" : "#E5E7EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            alignItems: variant === "directory" ? "center" : "flex-start",
          }}
        >
          <Photo
            item={item}
            kind={kind}
            size={
              variant === "department" ? 64 : variant === "nearby" ? 96 : 80
            }
            round={variant === "department"}
          />
          <View style={{ flex: 1, gap: 4 }}>
            <Heading
              numberOfLines={1}
              style={{
                fontSize: variant === "nearby" ? 18 : 16,
                fontWeight: "700",
              }}
            >
              {item.name}
            </Heading>
            {doctor ? (
              <>
                <Body
                  numberOfLines={1}
                  style={{
                    color:
                      variant === "directory"
                        ? "#EF4444"
                        : variant === "department"
                          ? "#2563EB"
                          : "#4B5563",
                    fontSize: variant === "directory" ? 12 : 14,
                    textTransform:
                      variant === "directory" ? "uppercase" : "none",
                    fontWeight: variant === "directory" ? "600" : "400",
                  }}
                >
                  {item.specialty}
                </Body>
                {variant === "department" && item.qualifications && (
                  <Body
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{ fontSize: 12 }}
                  >
                    {item.qualifications}
                  </Body>
                )}
                {item.experience && (
                  <Body
                    numberOfLines={1}
                    style={{ fontSize: variant === "directory" ? 11 : 12 }}
                  >
                    {variant === "directory" ? "EX  " : "Experience: "}
                    {item.experience}
                  </Body>
                )}
                <Body
                  numberOfLines={1}
                  style={{ fontSize: variant === "directory" ? 11 : 12 }}
                >
                  🏥{" "}
                  {item.hospital_name ||
                    item.hospitalName ||
                    "Center for Excellence"}
                </Body>
                {variant === "nearby" && <Stars value={item.rating} />}
              </>
            ) : (
              <>
                <Body numberOfLines={1}>
                  📍 {[item.city, item.state].filter(Boolean).join(", ")}
                </Body>
                <Body numberOfLines={1} style={{ fontSize: 10 }}>
                  ⭐ {item.rating ?? "—"} • {item.totalReviews ?? 0} reviews
                </Body>
                <Body
                  numberOfLines={1}
                  style={{
                    color: "#EF4444",
                    fontSize: 10,
                    fontWeight: "700",
                    textTransform: "uppercase",
                  }}
                >
                  ● {item.departments || "Multi-speciality hospital"}
                </Body>
              </>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
export function Care(props: {
  kind: string;
  department?: string;
  hospitalId?: string;
  navigate: Navigate;
  back(): void;
  departmentPage?: boolean;
}) {
  return props.kind === "pathlabs" ? (
    <Pathlabs navigate={props.navigate} back={props.back} />
  ) : (
    <Directory {...props} />
  );
}
function Directory({
  kind,
  department,
  hospitalId,
  navigate,
  back,
  departmentPage,
}: {
  kind: string;
  department?: string;
  hospitalId?: string;
  navigate: Navigate;
  back(): void;
  departmentPage?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);
  const slug = department
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const result = useResource<{
    data: CareItem[];
    pagination?: { totalPages: number };
  }>(
    department
      ? `/departments/${slug}/doctors`
      : `/${kind}?page=${page}&limit=10&search=${encodeURIComponent(query)}${hospitalId ? `&hospitalId=${hospitalId}` : ""}`,
  );
  const items = (result.data?.data || []).filter(
    (item) =>
      !department ||
      `${item.name} ${item.specialty} ${item.hospital_name}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const pages = result.data?.pagination?.totalPages || 1;
  const title = department
    ? department.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";
  return (
    <Screen
      title={
        department
          ? departmentPage
            ? title
            : `${title} Doctors`
          : kind === "hospitals"
            ? "Hospitals"
            : hospitalId
              ? "Hospital Doctors"
              : "All Doctors"
      }
      back={back}
    >
      {department &&
        (departmentPage ? (
          <Body>Find The Best {title} Doctors Near You</Body>
        ) : (
          <View style={{ gap: 4 }}>
            <Heading
              style={{
                fontSize: 24,
                textTransform: "capitalize",
                fontWeight: "700",
              }}
            >
              {title}
            </Heading>
            <Body>
              {items.length} {items.length === 1 ? "doctor" : "doctors"}{" "}
              available
            </Body>
          </View>
        ))}
      {(!department || departmentPage) && (
        <SearchInput
          placeholder={
            department
              ? "Search doctors..."
              : kind === "hospitals"
                ? "Search hospitals, city, or state..."
                : "Search doctors, specialties, or hospitals..."
          }
          value={search}
          onChange={setSearch}
        />
      )}
      {departmentPage && (
        <Heading style={{ fontSize: 20 }}>Top {title} Doctors</Heading>
      )}
      <ResourceState {...result} />
      {!result.loading && !result.error && !items.length && (
        <Empty
          title={
            department ? `No doctors found in ${title}.` : `No ${kind} found`
          }
          detail={
            department
              ? "Try another department or check again later."
              : "Try adjusting your search criteria"
          }
        />
      )}
      <View style={{ gap: 16 }}>
        {items.map((item) => (
          <ProviderCard
            key={item.id}
            item={item}
            kind={kind}
            navigate={navigate}
            variant={
              department
                ? departmentPage
                  ? "nearby"
                  : "department"
                : "directory"
            }
          />
        ))}
      </View>
      {pages > 1 && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Button
            title="‹"
            secondary
            disabled={page === 1}
            onPress={() => setPage((p) => p - 1)}
          />
          {Array.from({ length: pages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1)
            .map((n) => (
              <Button
                key={n}
                title={String(n)}
                secondary={page !== n}
                onPress={() => setPage(n)}
              />
            ))}
          <Button
            title="›"
            secondary
            disabled={page === pages}
            onPress={() => setPage((p) => p + 1)}
          />
        </View>
      )}
    </Screen>
  );
}
export function DetailLine({
  label,
  value,
  onPress,
}: {
  label: string;
  value?: string | number;
  onPress?: () => void;
}) {
  if (value == null || value === "") return null;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 14,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
      }}
    >
      <Body style={{ color: "#4B5563" }}>{label}:</Body>
      {onPress ? (
        <Pressable accessibilityRole="link" onPress={onPress}>
          <Body style={{ color: "#2563EB", textAlign: "right" }}>{value}</Body>
        </Pressable>
      ) : (
        <Body
          style={{
            color: "#111827",
            textAlign: "right",
            flex: 1,
            fontWeight: "500",
          }}
        >
          {value}
        </Body>
      )}
    </View>
  );
}
export function CareDetail(props: {
  kind: string;
  id: string;
  navigate: Navigate;
  back(): void;
}) {
  return props.kind === "pathlabs" ? (
    <PathlabDetail {...props} />
  ) : (
    <ProviderDetail {...props} />
  );
}
function ProviderDetail({
  kind,
  id,
  navigate,
  back,
}: {
  kind: string;
  id: string;
  navigate: Navigate;
  back(): void;
}) {
  const result = useResource<{ data: CareItem }>(
    `/${kind}/${encodeURIComponent(id)}`,
  );
  const [error, setError] = useState("");
  const item = result.data?.data;
  const doctor = kind === "doctors";
  function open(url: string) {
    void Linking.openURL(url).catch(() =>
      setError("Could not open this link."),
    );
  }
  return (
    <Screen title={doctor ? "Doctor Details" : "Hospital Details"} back={back}>
      <ResourceState {...result} />
      {!result.loading && !result.error && !item && (
        <Empty title={doctor ? "Doctor not found" : "Hospital not found"} />
      )}
      {item && (
        <>
          <Card
            style={{ padding: 20, boxShadow: "0 8px 12px rgba(0,0,0,0.08)" }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <Photo item={item} kind={kind} round />
              <View style={{ flex: 1, gap: 4 }}>
                <Heading style={{ fontSize: 20, fontWeight: "700" }}>
                  {item.name}
                </Heading>
                <Body
                  style={{
                    color: doctor ? "#2563EB" : "#4B5563",
                    fontSize: 14,
                  }}
                >
                  {doctor
                    ? item.specialty
                    : [item.city, item.state].filter(Boolean).join(", ")}
                </Body>
                {doctor && item.qualifications && (
                  <Body
                    numberOfLines={3}
                    ellipsizeMode="tail"
                    style={{ fontSize: 12 }}
                  >
                    {item.qualifications}
                  </Body>
                )}
                <Stars value={item.rating} reviews={item.totalReviews ?? 0} />
              </View>
            </View>
            {!doctor && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {[
                  [item.emergencyServices, "🚨 Emergency Services", "#FEE2E2"],
                  [item.ambulanceService, "🚑 Ambulance", "#DBEAFE"],
                  [item.parkingAvailable, "🅿️ Parking Available", "#DCFCE7"],
                ]
                  .filter(([enabled]) => enabled)
                  .map(([, text, bg]) => (
                    <Body
                      key={String(text)}
                      style={{
                        backgroundColor: String(bg),
                        borderRadius: 20,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        fontSize: 12,
                      }}
                    >
                      {String(text)}
                    </Body>
                  ))}
              </View>
            )}
            <View
              style={{
                paddingTop: 16,
                marginTop: 4,
                borderTopWidth: 1,
                borderTopColor: "#F3F4F6",
              }}
            >
              {doctor ? (
                <>
                  <DetailLine
                    label="Hospital"
                    value={item.hospitalName || item.hospital_name}
                  />
                  <DetailLine label="Department" value={item.departmentName} />
                  <DetailLine label="Experience" value={item.experience} />
                  <DetailLine
                    label="Consultation Fee"
                    value={
                      (item.consultationFees ?? item.consultation_fees) != null
                        ? `₹${item.consultationFees ?? item.consultation_fees}`
                        : undefined
                    }
                  />
                  <DetailLine label="Availability" value={item.availability} />
                </>
              ) : (
                <>
                  <DetailLine label="Address" value={item.address} />
                  <DetailLine label="Pincode" value={item.pincode} />
                  <DetailLine
                    label="Phone"
                    value={item.phone}
                    onPress={() => open(`tel:${item.phone}`)}
                  />
                  <DetailLine
                    label="Email"
                    value={item.email}
                    onPress={() => open(`mailto:${item.email}`)}
                  />
                  {item.website && /^https?:\/\//i.test(item.website) && (
                    <DetailLine
                      label="Website"
                      value="Visit Website"
                      onPress={() => open(item.website!)}
                    />
                  )}
                </>
              )}
            </View>
            {doctor ? (
              <>
                <Button
                  title="Book Your Appointment"
                  disabled={item.bookingAvailable === false}
                  onPress={() => navigate({ name: "booking", id })}
                />
                {item.bookingAvailable === false && (
                  <Body>
                    Online booking is unavailable. Contact this provider
                    directly.
                  </Body>
                )}
              </>
            ) : (
              <>
                {item.description && (
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: "#F3F4F6",
                      paddingTop: 16,
                      gap: 8,
                    }}
                  >
                    <Heading style={{ fontSize: 14 }}>About</Heading>
                    <Body>{item.description}</Body>
                  </View>
                )}
                {item.facilities && (
                  <View style={{ gap: 8 }}>
                    <Heading style={{ fontSize: 14 }}>Facilities</Heading>
                    <Body>
                      {Array.isArray(item.facilities)
                        ? item.facilities.join(" · ")
                        : item.facilities}
                    </Body>
                  </View>
                )}
              </>
            )}
          </Card>
          <ErrorText message={error} />
          {item.services?.map((service) => (
            <Card key={service.id}>
              <Heading>{service.name}</Heading>
              <Body>{service.description}</Body>
            </Card>
          ))}
          {item.photos?.map((photo) => (
            <View key={photo.url}>
              <Image
                source={{ uri: photo.url }}
                accessibilityLabel={photo.caption || "Provider photo"}
                style={{ height: 180, borderRadius: 12 }}
              />
              <Body>{photo.caption}</Body>
            </View>
          ))}
          {!doctor && <HospitalDepartments id={id} navigate={navigate} />}
          <RelatedDoctors
            hospitalId={doctor ? String(item.hospital_id || "") : id}
            exclude={doctor ? id : undefined}
            navigate={navigate}
          />
          {doctor && <WebFeedback navigate={navigate} />}
        </>
      )}
    </Screen>
  );
}
function RelatedDoctors({
  hospitalId,
  exclude,
  navigate,
}: {
  hospitalId: string;
  exclude?: string;
  navigate: Navigate;
}) {
  const result = useResource<{ data: CareItem[] }>(
    `/hospitals/${hospitalId || "0"}/doctors`,
  );
  const items = (result.data?.data || []).filter(
    (d) => String(d.id) !== exclude,
  );
  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Heading>
          {exclude ? "Doctors from Same Hospital" : "Our Doctors"}
        </Heading>
        {hospitalId && (
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigate({ name: "hospital-doctors", id: hospitalId })
            }
          >
            <Body style={{ color: "#111827", fontSize: 14 }}>See All</Body>
          </Pressable>
        )}
      </View>
      <ResourceState {...result} />
      {items.slice(0, 4).map((d) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View ${d.name}`}
          key={d.id}
          onPress={() =>
            navigate({ name: "detail", kind: "doctors", id: String(d.id) })
          }
        >
          <Card style={{ borderRadius: 8, padding: 12, gap: 4 }}>
            <Body style={{ color: "#111827", fontWeight: "500" }}>
              {d.name}
            </Body>
            <Body>{d.specialty}</Body>
          </Card>
        </Pressable>
      ))}
      {!result.loading && !items.length && (
        <Body>
          {exclude
            ? "No other doctors available."
            : "No doctors listed for this hospital."}
        </Body>
      )}
    </View>
  );
}
function HospitalDepartments({
  id,
  navigate,
}: {
  id: string;
  navigate: Navigate;
}) {
  const result = useResource<{
    data: { id: string; name: string; value?: string }[];
  }>(`/hospitals/${id}/departments`);
  const [all, setAll] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Heading>Our Departments</Heading>
        {(result.data?.data.length || 0) > 4 && (
          <Pressable accessibilityRole="button" onPress={() => setAll(!all)}>
            <Body>{all ? "Hide" : "See All"}</Body>
          </Pressable>
        )}
      </View>
      <ResourceState {...result} />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {result.data?.data.slice(0, all ? undefined : 4).map((d) => (
          <Pressable
            key={d.id}
            accessibilityRole="button"
            accessibilityLabel={d.name}
            style={{ width: "48%", flexGrow: 1 }}
            onPress={() =>
              navigate({ name: "department-doctors", query: d.value || d.name })
            }
          >
            <Card style={{ borderRadius: 8, padding: 12 }}>
              <Body style={{ color: "#111827" }}>🏥 {d.name}</Body>
            </Card>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
export function WebFeedback({ navigate }: { navigate: Navigate }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([
    {
      name: "Kajal Sharma",
      content: "Highly Professional And Empathetic Doctor",
      time: "2 days ago",
    },
  ]);
  return (
    <View style={{ gap: 16 }}>
      <Heading>User Feedback</Heading>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          accessibilityLabel="Add a comment"
          placeholder="Add a comment..."
          value={text}
          onChangeText={setText}
          style={{
            flex: 1,
            padding: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 8,
          }}
        />
        <Button
          title="Post"
          disabled={!text.trim()}
          onPress={() => {
            setComments([
              ...comments,
              { name: "Current User", content: text.trim(), time: "Just now" },
            ]);
            setText("");
          }}
        />
      </View>
      {comments.map((c, i) => (
        <View key={i} style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Body>{c.name[0]}</Body>
          </View>
          <View style={{ flex: 1 }}>
            <Body style={{ color: "#111827", fontWeight: "600" }}>
              {c.name}
            </Body>
            <Body>{c.content}</Body>
            <Body style={{ fontSize: 12 }}>{c.time}</Body>
          </View>
        </View>
      ))}
    </View>
  );
}
export function Choices({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange(value: string): void;
}) {
  return (
    <View
      accessibilityRole="radiogroup"
      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
    >
      {options.map((option) => (
        <Pressable
          key={option}
          accessibilityRole="radio"
          accessibilityState={{ checked: value === option }}
          onPress={() => onChange(option)}
          style={{
            paddingHorizontal: 15,
            minHeight: 44,
            justifyContent: "center",
            borderRadius: 24,
            backgroundColor: value === option ? colors.deep : "white",
            borderWidth: 1,
            borderColor: value === option ? colors.deep : colors.line,
          }}
        >
          <Text
            style={{
              fontFamily: "Merienda",
              fontSize: 12,
              color: value === option ? "white" : colors.muted,
            }}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export function SearchResults({
  query,
  navigate,
}: {
  query: string;
  navigate: Navigate;
}) {
  const result = useResource<{ results: (CareItem & { type: string })[] }>(
    `/search?q=${encodeURIComponent(query)}&limit=20`,
  );
  return (
    <>
      <ResourceState {...result} />
      {result.data?.results.length === 0 && (
        <Empty
          title="No matches found"
          detail="Try a different name or specialty."
        />
      )}
      {result.data?.results.map((item) => (
        <Row
          key={`${item.type}/${item.id}`}
          title={item.name}
          detail={item.type}
          icon="search-outline"
          onPress={() =>
            navigate(
              item.type === "department"
                ? { name: "care", kind: "doctors", query: item.name }
                : {
                    name: "detail",
                    kind: item.type === "doctor" ? "doctors" : "hospitals",
                    id: String(item.id),
                  },
            )
          }
        />
      ))}
    </>
  );
}
