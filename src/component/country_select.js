import React, { useEffect, useState } from "react";
import { Modal, TextInput, Group, List, Paper } from "@mantine/core";

const countries = [
  { flag: "https://flagcdn.com/mm.svg", value: "+95", label: "Myanmar" },
  { flag: "https://flagcdn.com/kr.svg", value: "+82", label: "South Korea" },
  { flag: "https://flagcdn.com/jp.svg", value: "+81", label: "Japan" },
  { flag: "https://flagcdn.com/vn.svg", value: "+84", label: "Vietnam" },
  { flag: "https://flagcdn.com/in.svg", value: "+91", label: "India" },
  { flag: "https://flagcdn.com/id.svg", value: "+62", label: "Indonesia" },
  { flag: "https://flagcdn.com/ar.svg", value: "+54", label: "Argentina" },
  { flag: "https://flagcdn.com/au.svg", value: "+61", label: "Australia" },
  { flag: "https://flagcdn.com/at.svg", value: "+43", label: "Austria" },
  { flag: "https://flagcdn.com/br.svg", value: "+55", label: "Brazil" },
  { flag: "https://flagcdn.com/sg.svg", value: "+65", label: "Singapore" },
  { flag: "https://flagcdn.com/fr.svg", value: "+33", label: "France" },
  { flag: "https://flagcdn.com/th.svg", value: "+66", label: "Thailand" },
];

export default function CountrySelect({ changeCountryCode }) {
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredCountry, setCountry] = useState([]);
  // const [debounced] = useDebouncedValue(search, 200, { leading: true });

  const [country, setCountryCode] = useState({
    flag: "https://flagcdn.com/mm.svg",
    value: "+95",
  });

  useEffect(() => {
    setCountry(countries);
  }, []);

  useEffect(() => {
    const filtered = countries.filter((country) => {
      // console.log("country");
      return country.label.toLowerCase().includes(search.toLowerCase());
    });
    // console.log("search", search);
    // console.log("filter", filtered);
    setCountry(filtered);
  }, [search]);

  const changeSearch = (event) => {
    if (event.currentTarget.value === "") {
      // setShow(true);
      setCountry(countries);
    } else {
      // setShow(false);
      setSearch(event.currentTarget.value);
    }
  };

  const filteredList = (list) =>
    list.map((country) => (
      <Paper
        shadow="xs"
        p="xs"
        my={10}
        style={{
          cursor: "pointer",
          background: "#f4f3ee",
        }}
        key={country.value}
        onClick={() => {
          setCountryCode({
            flag: country.flag,
            value: country.value,
          });
          changeCountryCode(country.value);
          setOpened(false);
        }}
      >
        <List.Item
          icon={
            <img src={`${country.flag}`} alt="flg" width={40} height={40} />
          }
        >
          {country.label}
        </List.Item>
      </Paper>
    ));
  return (
    <>
      <Modal
        opened={opened}
        centered
        closeOnClickOutside={false}
        onClose={() => {
          setSearch("");
          setOpened(false);
        }}
        title="Select Your Country"
      >
        <TextInput
          placeholder="Search"
          size="lg"
          // defaultValue={search}
          // value={search}
          onChange={changeSearch}
        />
        <List spacing="xs" size="sm" center my={20}>
          {filteredList(filteredCountry)}
        </List>
      </Modal>
      <Group
        noWrap
        style={{
          border: "1px solid green",
          padding: "8px 20px",
          cursor: "pointer",
        }}
        onClick={() => setOpened(true)}
      >
        <img src={`${country.flag}`} alt="flg" width={30} height={30} />
        <span style={{ color: "green" }}>{`${country.value}`}</span>
      </Group>
    </>
  );
}
